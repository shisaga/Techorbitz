import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();
    
    // Generate estimation based on project data
    const estimation = generateEstimation(projectData);
    
    // TODO: Save to database
    // await prisma.projectEstimate.create({ data: { ...estimation, id: uuidv4() } });
    
    // TODO: Send email notification
    // await sendEstimationEmail(projectData.email, estimation);
    
    return NextResponse.json({
      success: true,
      estimation,
      estimateId: uuidv4()
    });

  } catch (error) {
    console.error('Error generating estimate:', error);
    return NextResponse.json(
      { error: 'Failed to generate estimate' },
      { status: 500 }
    );
  }
}

function generateEstimation(projectData: any) {
  // Basic estimation logic based on project type and requirements
  const baseRates = {
    'web-app': { min: 50000, max: 100000, weeks: 12 },
    'mobile-app': { min: 40000, max: 80000, weeks: 10 },
    'ai-ml': { min: 75000, max: 150000, weeks: 16 },
    'cloud-infrastructure': { min: 60000, max: 120000, weeks: 14 },
    'iot-solution': { min: 80000, max: 160000, weeks: 18 },
    'database-optimization': { min: 30000, max: 70000, weeks: 8 },
    'medical-software': { min: 100000, max: 200000, weeks: 20 },
    'video-production': { min: 20000, max: 50000, weeks: 6 },
    'graphic-design': { min: 15000, max: 40000, weeks: 4 }
  };

  const projectType = projectData.projectType || 'web-app';
  const rates = baseRates[projectType as keyof typeof baseRates] || baseRates['web-app'];
  
  // Adjust based on budget and timeline
  const budgetMultiplier = getBudgetMultiplier(projectData.budget);
  const timelineMultiplier = getTimelineMultiplier(projectData.timeline);
  
  const adjustedMin = Math.round(rates.min * budgetMultiplier * timelineMultiplier);
  const adjustedMax = Math.round(rates.max * budgetMultiplier * timelineMultiplier);
  const adjustedWeeks = Math.round(rates.weeks * timelineMultiplier);

  return {
    projectType: projectData.projectType,
    estimatedCost: `$${adjustedMin.toLocaleString()} - $${adjustedMax.toLocaleString()}`,
    timeline: `${Math.floor(adjustedWeeks / 4)}-${Math.ceil(adjustedWeeks / 4)} months`,
    teamSize: getTeamSizeRecommendation(projectData.teamSize),
    confidence: '85%',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    technologies: projectData.technologies || [],
    phases: generatePhases(adjustedWeeks, adjustedMin, adjustedMax)
  };
}

function getBudgetMultiplier(budget: string): number {
  const multipliers: { [key: string]: number } = {
    '10k-25k': 0.3,
    '25k-50k': 0.6,
    '50k-100k': 1.0,
    '100k-250k': 1.5,
    '250k+': 2.0
  };
  return multipliers[budget] || 1.0;
}

function getTimelineMultiplier(timeline: string): number {
  const multipliers: { [key: string]: number } = {
    '1-3months': 0.7,
    '3-6months': 1.0,
    '6-12months': 1.3,
    '12months+': 1.6
  };
  return multipliers[timeline] || 1.0;
}

function getTeamSizeRecommendation(teamSize: string): string {
  const recommendations: { [key: string]: string } = {
    '1-3': '2-3 senior developers',
    '4-8': '5-7 developers + PM',
    '9-15': '8-12 developers + 2 PMs',
    '15+': '12+ developers + multiple PMs'
  };
  return recommendations[teamSize] || '3-5 developers';
}

function generatePhases(totalWeeks: number, minCost: number, maxCost: number) {
  const phases = [
    { name: 'Discovery & Planning', percentage: 0.15, weeks: 2 },
    { name: 'Design & Architecture', percentage: 0.20, weeks: 3 },
    { name: 'Development Phase 1', percentage: 0.35, weeks: Math.floor(totalWeeks * 0.4) },
    { name: 'Development Phase 2', percentage: 0.25, weeks: Math.floor(totalWeeks * 0.3) },
    { name: 'Testing & Deployment', percentage: 0.05, weeks: 2 }
  ];

  return phases.map(phase => ({
    phase: phase.name,
    duration: `${phase.weeks} weeks`,
    cost: `$${Math.round(minCost * phase.percentage).toLocaleString()} - $${Math.round(maxCost * phase.percentage).toLocaleString()}`
  }));
}
