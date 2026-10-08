export type InvestorStatus = 'Out' | 'Skeptical' | 'Active' | 'Impressed';
export type DealStatus = 'Negotiating' | 'Deal Offered' | 'Rejected';

export interface InvestorEvaluation {
  name: string;
  role: string;
  status: InvestorStatus;
  interest_score: number;
  strength: string;
  concern: string;
  feedback: string;
}

export interface CrossDebate {
  speaker: string;
  target: string;
  message: string;
}

export interface PitchMetrics {
  overall_sentiment_score: number;
  current_valuation: string;
  funding_requested: string;
  equity_offered_percent: number;
  deal_status: DealStatus;
}

export interface PitchEvaluationResult {
  investors: {
    aman: InvestorEvaluation;
    namita: InvestorEvaluation;
    peyush: InvestorEvaluation;
  };
  cross_debate: CrossDebate;
  metrics: PitchMetrics;
  // Optional extra arena analysis generated or calculated
  analysis?: {
    tech_defensibility?: {
      level: 'Low (Wrapper Risk)' | 'Moderate' | 'High (Proprietary Moat)';
      notes: string;
    };
    unit_economics_check?: {
      status: 'Healthy' | 'Vulnerable' | 'Unknown Data';
      implied_ask_valuation: string;
      notes: string;
    };
    product_vision_fit?: {
      rating: 'High Conviction' | 'Needs Polish' | 'Niche';
      notes: string;
    };
  };
}

export interface StartupPitchInput {
  startup_name: string;
  tagline: string;
  problem: string;
  target_customers: string;
  solution: string;
  usp: string;
  business_model: string;
  traction: string;
  tech_stack: string;
  ask_amount: string;
  equity_percent: number | string;
}

export interface RebuttalRequest {
  pitch: StartupPitchInput;
  previous_result: PitchEvaluationResult;
  founder_defense: string;
  revised_ask?: string;
  revised_equity?: number | string;
}
