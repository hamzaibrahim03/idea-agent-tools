import h_ad_copy from '../_lib/tools/ad-copy.js';
import h_api_doc_template from '../_lib/tools/api-doc-template.js';
import h_blog_post_outline from '../_lib/tools/blog-post-outline.js';
import h_business_email_template from '../_lib/tools/business-email-template.js';
import h_business_name from '../_lib/tools/business-name.js';
import h_business_plan_outline from '../_lib/tools/business-plan-outline.js';
import h_contract_outline from '../_lib/tools/contract-outline.js';
import h_cover_letter from '../_lib/tools/cover-letter.js';
import h_customer_persona from '../_lib/tools/customer-persona.js';
import h_demand_letter from '../_lib/tools/demand-letter.js';
import h_elevator_pitch from '../_lib/tools/elevator-pitch.js';
import h_employment_offer_letter from '../_lib/tools/employment-offer-letter.js';
import h_exam_paper from '../_lib/tools/exam-paper.js';
import h_flashcards from '../_lib/tools/flashcards.js';
import h_hashtags from '../_lib/tools/hashtags.js';
import h_interview_questions from '../_lib/tools/interview-questions.js';
import h_learning_roadmap from '../_lib/tools/learning-roadmap.js';
import h_nda from '../_lib/tools/nda.js';
import h_newsletter_template from '../_lib/tools/newsletter-template.js';
import h_notice_to_vacate from '../_lib/tools/notice-to-vacate.js';
import h_partnership_agreement_outline from '../_lib/tools/partnership-agreement-outline.js';
import h_power_of_attorney_outline from '../_lib/tools/power-of-attorney-outline.js';
import h_presentation_outline from '../_lib/tools/presentation-outline.js';
import h_privacy_policy from '../_lib/tools/privacy-policy.js';
import h_product_description_template from '../_lib/tools/product-description-template.js';
import h_product_name from '../_lib/tools/product-name.js';
import h_property_description_template from '../_lib/tools/property-description-template.js';
import h_proposal_outline from '../_lib/tools/proposal-outline.js';
import h_quiz from '../_lib/tools/quiz.js';
import h_rental_agreement_outline from '../_lib/tools/rental-agreement-outline.js';
import h_seo_title_meta_description from '../_lib/tools/seo-title-meta-description.js';
import h_social_media_post_template from '../_lib/tools/social-media-post-template.js';
import h_sop_template from '../_lib/tools/sop-template.js';
import h_study_plan from '../_lib/tools/study-plan.js';
import h_terms_and_conditions from '../_lib/tools/terms-and-conditions.js';
import h_video_script_outline from '../_lib/tools/video-script-outline.js';

const registry = {
  "ad-copy": h_ad_copy,
  "api-doc-template": h_api_doc_template,
  "blog-post-outline": h_blog_post_outline,
  "business-email-template": h_business_email_template,
  "business-name": h_business_name,
  "business-plan-outline": h_business_plan_outline,
  "contract-outline": h_contract_outline,
  "cover-letter": h_cover_letter,
  "customer-persona": h_customer_persona,
  "demand-letter": h_demand_letter,
  "elevator-pitch": h_elevator_pitch,
  "employment-offer-letter": h_employment_offer_letter,
  "exam-paper": h_exam_paper,
  "flashcards": h_flashcards,
  "hashtags": h_hashtags,
  "interview-questions": h_interview_questions,
  "learning-roadmap": h_learning_roadmap,
  "nda": h_nda,
  "newsletter-template": h_newsletter_template,
  "notice-to-vacate": h_notice_to_vacate,
  "partnership-agreement-outline": h_partnership_agreement_outline,
  "power-of-attorney-outline": h_power_of_attorney_outline,
  "presentation-outline": h_presentation_outline,
  "privacy-policy": h_privacy_policy,
  "product-description-template": h_product_description_template,
  "product-name": h_product_name,
  "property-description-template": h_property_description_template,
  "proposal-outline": h_proposal_outline,
  "quiz": h_quiz,
  "rental-agreement-outline": h_rental_agreement_outline,
  "seo-title-meta-description": h_seo_title_meta_description,
  "social-media-post-template": h_social_media_post_template,
  "sop-template": h_sop_template,
  "study-plan": h_study_plan,
  "terms-and-conditions": h_terms_and_conditions,
  "video-script-outline": h_video_script_outline,
};

export default async function handler(req, res) {
  const { slug } = req.query || {};
  const toolHandler = registry[slug];
  if (!toolHandler) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  return toolHandler(req, res);
}
