"""
services/gemini_service.py
Gemini 1.5 Flash Multimodal Service for Crop Disease Analysis
Optimized for Indian agricultural context
"""

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import logging
from typing import Dict, Optional, List, Any
import json
import base64
from PIL import Image
import io
import os

logger = logging.getLogger(__name__)

class GeminiService:
    """
    Gemini 1.5 Flash service for agricultural intelligence
    Handles both text and vision tasks
    """
    
    def __init__(self):
        self.model = None
        self.vision_model = None
        self._initialize_models()
        
        # Indian agricultural context
        self.crop_knowledge_base = {
            "common_crops": [
                "rice", "wheat", "cotton", "sugarcane", "maize",
                "potato", "tomato", "chili", "onion", "tea"
            ],
            "regions": {
                "maharashtra": ["cotton", "sugarcane", "soybean"],
                "punjab": ["wheat", "rice"],
                "kerala": ["coconut", "rubber", "tea"],
                "tamil_nadu": ["rice", "sugarcane", "cotton"]
            }
        }
        
    def _initialize_models(self):
        """Initialize Gemini models"""
        try:
            api_key = os.getenv("GOOGLE_API_KEY")
            genai.configure(api_key=api_key)
            
            # --- FIX: Switched to Stable 1.5 Flash Model (High Quota) ---
            # This fixes the "429 Quota Exceeded" error (Limit: 1500/day)
            model_name = "gemini-1.5-flash"

            # Text model for queries
            self.model = genai.GenerativeModel(
                model_name=model_name,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "top_k": 40,
                    "max_output_tokens": 2048,
                },
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                }
            )
            
            # Vision model for image analysis
            self.vision_model = genai.GenerativeModel(
                model_name=model_name,
                generation_config={
                    "temperature": 0.4,  # Lower for factual accuracy
                    "top_p": 0.95,
                    "max_output_tokens": 3072,
                }
            )
            
            logger.info(f"Gemini models initialized successfully using {model_name}")
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {str(e)}")
            raise
    
    async def analyze_crop_disease(
        self,
        image_data: bytes,
        additional_context: Optional[str] = None,
        location: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Analyze crop disease from image using Gemini 1.5 Flash
        
        Returns detailed diagnosis with Indian agricultural regulations
        """
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Construct detailed prompt for Indian context
            prompt = self._build_crop_analysis_prompt(additional_context, location)
            
            # Generate multimodal response
            response = self.vision_model.generate_content([prompt, image])
            
            # Parse structured response
            analysis = self._parse_crop_analysis(response.text)
            
            # Add confidence score based on response quality
            analysis["confidence"] = self._calculate_confidence(response)
            analysis["raw_response"] = response.text
            
            return analysis
            
        except Exception as e:
            logger.error(f"Crop analysis error: {str(e)}")
            raise
    
    def _build_crop_analysis_prompt(
        self,
        context: Optional[str],
        location: Optional[Dict]
    ) -> str:
        """
        Build comprehensive prompt for crop disease analysis
        Includes Indian agricultural regulations and best practices
        """
        base_prompt = """
You are an expert agricultural AI assistant specializing in Indian farming practices and crop diseases.

Analyze this crop image and provide a comprehensive diagnosis following this structure:

1. **CROP IDENTIFICATION**
   - Identify the crop type
   - Growth stage
   - Overall health assessment

2. **DISEASE/PEST DIAGNOSIS**
   - Specific disease or pest name (scientific and common name in English and Hindi)
   - Severity level: Mild / Moderate / Severe / Critical
   - Affected parts of the plant
   - Stage of infection

3. **TREATMENT PLAN (Compliant with Indian Agricultural Regulations)**
   - Organic/natural remedies (first priority)
   - Chemical pesticides (only if necessary, with proper safety warnings)
   - Bio-pesticides approved by CIB&RC (Central Insecticides Board & Registration Committee)
   - Dosage and application method
   - Safety precautions
   - Re-entry interval (REI) and pre-harvest interval (PHI)

4. **PREVENTION MEASURES**
   - Cultural practices
   - Crop rotation suggestions
   - Irrigation management
   - Soil health improvement

5. **REGIONAL CONSIDERATIONS**
   - Season-specific advice
   - Local climate factors
   - Region-specific best practices

**IMPORTANT GUIDELINES:**
- Prioritize farmer safety and environmental sustainability
- Follow BIS (Bureau of Indian Standards) guidelines
- Recommend only legally approved pesticides in India
- Provide cost-effective solutions for small-scale farmers
- Include traditional/indigenous practices where applicable
- Warn against banned pesticides (e.g., Monocrotophos, Methyl Parathion)

Format your response as structured JSON with these keys:
- crop_type
- disease_name (in English and Hindi)
- disease_name_scientific
- severity
- symptoms_observed
- treatment_steps (array)
- organic_solutions (array)
- chemical_solutions (array with safety warnings)
- prevention_tips (array)
- estimated_recovery_time
- cost_estimate_inr
- urgent_action_required (boolean)
"""
        
        if context:
            base_prompt += f"\n\nADDITIONAL CONTEXT: {context}"
        
        if location:
            base_prompt += f"\n\nLOCATION: Latitude {location.get('lat')}, Longitude {location.get('lng')}"
            base_prompt += "\nProvide region-specific advice based on this location."
        
        return base_prompt
    
    def _parse_crop_analysis(self, response_text: str) -> Dict[str, Any]:
        """
        Parse Gemini response into structured format
        Handles both JSON and natural language responses
        """
        try:
            # Try to extract JSON from response
            # Gemini may wrap JSON in markdown code blocks
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_str = response_text[json_start:json_end].strip()
                return json.loads(json_str)
            
            # If no JSON, attempt to parse as JSON directly
            return json.loads(response_text)
            
        except json.JSONDecodeError:
            # Fallback: Extract structured data from natural language
            return self._extract_structured_data(response_text)
    
    def _extract_structured_data(self, text: str) -> Dict[str, Any]:
        """
        Extract structured data from natural language response
        Fallback when JSON parsing fails
        """
        return {
            "crop_type": "Unknown",
            "disease_name": "Analysis Pending",
            "disease_name_scientific": "",
            "severity": "Moderate",
            "symptoms_observed": [text[:200]],
            "treatment_steps": [
                "Consult local agricultural extension officer",
                "Get detailed laboratory analysis"
            ],
            "organic_solutions": [],
            "chemical_solutions": [],
            "prevention_tips": ["Regular crop monitoring"],
            "estimated_recovery_time": "Unknown",
            "cost_estimate_inr": "Varies",
            "urgent_action_required": False,
            "note": "Response parsing incomplete. Full text available in raw_response."
        }
    
    def _calculate_confidence(self, response) -> float:
        """
        Calculate confidence score based on response quality
        """
        try:
            # Check for safety ratings and response completeness
            if not response.text or len(response.text) < 100:
                return 0.3
            
            # Higher confidence for longer, detailed responses
            length_score = min(len(response.text) / 1000, 0.5)
            
            # Check for structured data
            structure_score = 0.3 if "```json" in response.text else 0.2
            
            return min(length_score + structure_score + 0.2, 0.95)
            
        except:
            return 0.5
    
    async def process_agricultural_query(
        self,
        query: str,
        language: str,
        user_context: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Process text-based agricultural queries
        Handles voice transcription results
        """
        try:
            # Build context-aware prompt
            prompt = f"""
You are a knowledgeable agricultural expert assistant for Indian farmers.

User Query: {query}
Query Language: {language}

Provide practical, actionable advice considering:
- Indian agricultural practices and regulations
- Cost-effectiveness for small farmers
- Regional climate and soil conditions
- Seasonal factors
- Traditional knowledge integration

Respond in a conversational, farmer-friendly tone.
Include specific steps, measurements, and timelines.
Warn about safety precautions where applicable.

If you recommend any chemicals or fertilizers, ensure they are:
1. Approved by Indian authorities (CIB&RC, FSSAI)
2. Readily available in rural markets
3. Within the economic reach of small farmers
"""
            
            response = self.model.generate_content(prompt)
            
            return {
                "response_text": response.text,
                "query_category": self._categorize_query(query),
                "confidence": 0.85,
                "follow_up_suggestions": self._generate_follow_ups(query)
            }
            
        except Exception as e:
            logger.error(f"Query processing error: {str(e)}")
            raise
    
    def _categorize_query(self, query: str) -> str:
        """Categorize the type of agricultural query"""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ["disease", "pest", "infection"]):
            return "disease_diagnosis"
        elif any(word in query_lower for word in ["fertilizer", "nutrient", "soil"]):
            return "soil_nutrition"
        elif any(word in query_lower for word in ["weather", "rain", "season"]):
            return "weather_related"
        elif any(word in query_lower for word in ["price", "market", "sell"]):
            return "market_info"
        else:
            return "general_farming"
    
    def _generate_follow_ups(self, query: str) -> List[str]:
        """Generate relevant follow-up questions"""
        category = self._categorize_query(query)
        
        follow_ups = {
            "disease_diagnosis": [
                "Would you like to upload a photo of the affected crop?",
                "Have you tried any treatments yet?",
                "When did you first notice these symptoms?"
            ],
            "soil_nutrition": [
                "Have you done a soil test recently?",
                "What crop are you planning to grow next?",
                "What's your budget for soil amendments?"
            ],
            "weather_related": [
                "Would you like a 7-day weather forecast?",
                "Should we set up weather alerts for your location?",
                "What crops are you currently growing?"
            ]
        }
        
        return follow_ups.get(category, [
            "How can I help you further?",
            "Would you like specific recommendations?"
        ])
    
    def format_analysis_for_speech(self, analysis: Dict) -> str:
        """
        Format analysis for text-to-speech output
        Makes it more conversational and less technical
        """
        crop = analysis.get("crop_type", "your crop")
        disease = analysis.get("disease_name", "a problem")
        severity = analysis.get("severity", "moderate")
        
        speech_text = f"""
Your {crop} appears to have {disease}. The severity is {severity}.

Here's what you need to do:

"""
        
        # Add treatment steps
        for i, step in enumerate(analysis.get("treatment_steps", [])[:3], 1):
            speech_text += f"{i}. {step}\n"
        
        speech_text += "\nFor best results, follow these steps carefully. "
        
        if analysis.get("urgent_action_required"):
            speech_text += "This requires immediate attention. "
        
        return speech_text
    
    def is_healthy(self) -> bool:
        """Health check"""
        return self.model is not None and self.vision_model is not None
