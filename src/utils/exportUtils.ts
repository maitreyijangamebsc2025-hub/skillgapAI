import jsPDF from 'jspdf';
import { AnalyzedSkill, AnalysisSummary, CurriculumRecommendation } from '../types/skills';
import { MARKET_METADATA } from '../data/marketMetadata';

export function exportToCSV(
  analyzedSkills: AnalyzedSkill[],
  surplusSkills: AnalyzedSkill[],
  alignmentScore: number
) {
  const headers = [
    'Skill',
    'Category',
    'Demand (%)',
    'Status',
    'Depth (0-4)',
    'Depth Label',
    'Rule-based Confidence (%)',
    'Match Type',
    'Evidence',
    'Matching Course / Module',
  ];

  const allRows = [
    ...analyzedSkills.map((s) => [
      `"${s.skill}"`,
      `"${s.category}"`,
      s.demand_pct.toFixed(1),
      `"${s.status}"`,
      s.depth ?? 0,
      `"${s.depth_label || 'Not covered'}"`,
      `${s.confidence ?? 95}%`,
      `"${s.match_type || 'EXACT'}"`,
      `"${(s.evidence || 'N/A').replace(/"/g, '""')}"`,
      `"${(s.matching_course || 'Not covered in curriculum').replace(/"/g, '""')}"`,
    ]),
    ...surplusSkills.map((s) => [
      `"${s.skill}"`,
      `"${s.category}"`,
      s.demand_pct > 0 ? s.demand_pct.toFixed(1) : '<1.0',
      `"SURPLUS"`,
      s.depth ?? 3,
      `"${s.depth_label || 'Practical/project'}"`,
      `${s.confidence ?? 95}%`,
      `"EXACT"`,
      `"${(s.evidence || 'Taught in curriculum with niche market demand in dataset').replace(/"/g, '""')}"`,
      `"${(s.matching_course || 'Taught in curriculum').replace(/"/g, '""')}"`,
    ]),
  ];

  const csvContent = [
    `# Accreditation-Oriented Curriculum Gap Analysis Matrix`,
    `# Demand-Weighted Alignment Score: ${alignmentScore}% (Formula: Σ(c_i * w_i) / Σ(w_i) * 100, where c_i: 1.0=Covered, 0.5/0.25=Partial, 0=Gap)`,
    `# Dataset: ${MARKET_METADATA.datasetSource}`,
    `# Disclaimer: ${MARKET_METADATA.proxyDisclaimer}`,
    `# Export Date: ${new Date().toLocaleDateString()}`,
    '',
    headers.join(','),
    ...allRows.map((r) => r.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Curriculum_Gap_Analysis_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(
  summary: AnalysisSummary,
  recommendations: CurriculumRecommendation[] = []
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Accreditation-Oriented Curriculum Gap Analysis', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Benchmark: ${MARKET_METADATA.datasetSource} | Generated: ${new Date().toLocaleDateString()}`,
    14,
    20
  );

  y = 36;

  // Executive Score Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2.5, 2.5, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Demand-Weighted Alignment Score', 18, y + 8);

  const scoreColor =
    summary.alignmentScore >= 75 ? [16, 185, 129] : summary.alignmentScore >= 50 ? [217, 119, 6] : [225, 29, 72];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`${summary.alignmentScore}%`, 18, y + 19);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Formula: Σ(c_i × w_i) / Σ(w_i) × 100 [c_i: 1.0=Covered, 0.5/0.25=Partial, 0=Gap]', 18, y + 26);

  // Breakdown metrics
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(`Covered: ${summary.coveredSkillsCount}`, 85, y + 11);
  doc.text(`Partial: ${summary.partialSkillsCount || 0}`, 120, y + 11);
  doc.text(`Gaps: ${summary.gapSkillsCount}`, 155, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Surplus (Specialized): ${summary.surplusSkillsCount}`, 85, y + 19);
  doc.text(`Evaluated Demand: ${summary.totalEvaluatedDemand || 100}%`, 130, y + 19);

  y += 36;

  // Market Transparency Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text('Market Proxy Disclosure:', 18, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Job postings (${MARKET_METADATA.datasetPeriod}, ${MARKET_METADATA.geography}) serve as an empirical proxy for market demand, not the entirety of employment.`,
    18,
    y + 10
  );

  y += 20;

  // Key Category Breakdown Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Technical Domain Coverage Breakdown', 14, y);
  y += 5;

  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 6.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Domain Pillar', 18, y + 4.5);
  doc.text('Market Skills', 65, y + 4.5);
  doc.text('Covered (D3-4)', 100, y + 4.5);
  doc.text('Partial (D1-2)', 135, y + 4.5);
  doc.text('Coverage %', 165, y + 4.5);
  y += 6.5;

  doc.setFont('helvetica', 'normal');
  summary.categoryStats.forEach((cat) => {
    doc.setTextColor(30, 41, 59);
    doc.text(cat.category, 18, y + 4.5);
    doc.text(`${cat.totalMarket}`, 65, y + 4.5);
    doc.text(`${cat.covered}`, 100, y + 4.5);
    doc.text(`${cat.partial || 0}`, 135, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(cat.coveragePct >= 60 ? 22 : 185, cat.coveragePct >= 60 ? 101 : 28, cat.coveragePct >= 60 ? 52 : 28);
    doc.text(`${cat.coveragePct}%`, 165, y + 4.5);
    doc.setFont('helvetica', 'normal');

    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 6, pageWidth - 14, y + 6);
    y += 6;
  });

  y += 6;

  // Critical Gaps Table with Evidence & Depth
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Top Unaddressed Skill Gaps (Depth 0)', 14, y);
  y += 5;

  doc.setFillColor(254, 242, 242);
  doc.rect(14, y, pageWidth - 28, 6.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(153, 27, 27);
  doc.text('Market Skill', 18, y + 4.5);
  doc.text('Category', 60, y + 4.5);
  doc.text('Demand %', 100, y + 4.5);
  doc.text('Rule Conf.', 130, y + 4.5);
  doc.text('Audit Evidence', 155, y + 4.5);
  y += 6.5;

  doc.setFont('helvetica', 'normal');
  const criticalGaps = summary.analyzedSkills.filter((s) => s.status === 'GAP').slice(0, 8);
  criticalGaps.forEach((gap) => {
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.text(gap.skill, 18, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(gap.category, 60, y + 4.5);
    doc.text(`${gap.demand_pct}%`, 100, y + 4.5);
    doc.text(`${gap.confidence}%`, 130, y + 4.5);
    doc.setTextColor(100, 116, 139);
    doc.text((gap.evidence || 'No curriculum coverage detected').slice(0, 28), 155, y + 4.5);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 6, pageWidth - 14, y + 6);
    y += 5.8;
  });

  // Page 2: Recommendations & Methodology
  if (recommendations && recommendations.length > 0) {
    doc.addPage();
    let y2 = 18;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Strategic Curriculum Roadmap & AI Advisory', 14, 12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('Prescriptive modifications with academic levels and implementation milestones', 14, 18);

    y2 = 32;

    recommendations.slice(0, 4).forEach((rec, idx) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, y2, pageWidth - 28, 38, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${rec.title}`, 18, y2 + 6.5);

      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`[${rec.priority} Priority] | ${rec.type} | Level: ${rec.academic_level || 'Graduate'} | Effort: ${rec.estimated_effort}`, 18, y2 + 11.5);

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      const rationaleLines = doc.splitTextToSize(`Rationale: ${rec.rationale}`, pageWidth - 36);
      doc.text(rationaleLines.slice(0, 2), 18, y2 + 17);

      if (rec.prerequisites && rec.prerequisites.length > 0) {
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(7);
        doc.text(`Prerequisites: ${rec.prerequisites.join(', ')}`, 18, y2 + 25);
      }

      if (rec.implementation_steps && rec.implementation_steps.length > 0) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(7);
        doc.text(`Milestone 1: ${rec.implementation_steps[0].slice(0, 85)}`, 18, y2 + 30);
        if (rec.implementation_steps[1]) {
          doc.text(`Milestone 2: ${rec.implementation_steps[1].slice(0, 85)}`, 18, y2 + 34);
        }
      }

      y2 += 43;
    });

    // Limitations & Accreditation Note
    y2 = Math.min(y2 + 2, 255);
    doc.setFillColor(254, 252, 232);
    doc.setDrawColor(254, 240, 138);
    doc.roundedRect(14, y2, pageWidth - 28, 26, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(133, 77, 14);
    doc.text('Methodology, Limitations & Outcome Transparency:', 18, y2 + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(113, 63, 18);
    const disclaimerLines = doc.splitTextToSize(
      'This document represents an accreditation-oriented curriculum gap analysis. Evaluated demand weights reflect empirical hiring frequencies from Kaggle telemetry and serve as an informative proxy. Adding recommended technologies enhances market alignment but does not guarantee employment outcomes or accreditation certification.',
      pageWidth - 36
    );
    doc.text(disclaimerLines, 18, y2 + 11);
  }

  doc.save(`Accreditation_Curriculum_Gap_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`);
}
