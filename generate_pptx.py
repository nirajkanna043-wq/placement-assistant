import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Color palette
    COLOR_INK = RGBColor(0x1B, 0x1F, 0x23)      # #1B1F23
    COLOR_PANEL = RGBColor(0x22, 0x28, 0x2E)    # #22282E
    COLOR_TEAL = RGBColor(0x2F, 0x6F, 0x6F)     # #2F6F6F Runway
    COLOR_AMBER = RGBColor(0xD9, 0xA4, 0x41)    # #D9A441
    COLOR_RUST = RGBColor(0xB4, 0x53, 0x2A)     # #B4532A
    COLOR_WHITE = RGBColor(0xFF, 0xFF, 0xFF)
    COLOR_MUTED = RGBColor(0x9E, 0xA5, 0xAF)
    COLOR_LIGHT_BG = RGBColor(0xFA, 0xF7, 0xF0) # #FAF7F0 Parchment
    COLOR_CARD_BG = RGBColor(0xF1, 0xEC, 0xDF)  # #F1ECDF Paper
    COLOR_LINE = RGBColor(0xDD, 0xD5, 0xC2)

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background() # no border
        return bg

    def add_header(slide, tag, title, is_dark=False):
        # Tag
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.5), Inches(0.4))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = COLOR_AMBER if is_dark else COLOR_TEAL

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.5), Inches(0.8))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.name = "Georgia"
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE if is_dark else COLOR_INK

    def add_card(slide, x, y, w, h, bg_color=COLOR_CARD_BG, border_color=COLOR_LINE):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1.5)
        else:
            shape.line.fill.background()
        return shape

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide (Dark)
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, COLOR_INK)

    # Decorative top badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(3.2), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = COLOR_PANEL
    badge.line.color.rgb = COLOR_AMBER
    badge.line.width = Pt(1)
    b_tf = badge.text_frame
    b_p = b_tf.paragraphs[0]
    b_p.text = "AI & ML CAPSTONE PROJECT"
    b_p.font.name = "Arial"
    b_p.font.size = Pt(11)
    b_p.font.bold = True
    b_p.font.color.rgb = COLOR_AMBER
    b_p.alignment = PP_ALIGN.CENTER

    # Main Title
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.85), Inches(11.5), Inches(2.2))
    tf = t_box.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "Readiness: AI-Powered Placement\nPreparation Assistant & Predictor"
    p1.font.name = "Georgia"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE

    p2 = tf.add_paragraph()
    p2.text = "An End-to-End System Integrating NLP, Bayesian Knowledge Tracing, Explainable AI (XAI), and Speech Analytics"
    p2.font.name = "Arial"
    p2.font.size = Pt(16)
    p2.font.color.rgb = COLOR_MUTED
    p2.space_before = Pt(14)

    # Bottom Metadata Card
    meta_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.5), Inches(11.7), Inches(2.0))
    meta_box.fill.solid()
    meta_box.fill.fore_color.rgb = COLOR_PANEL
    meta_box.line.color.rgb = COLOR_TEAL
    meta_box.line.width = Pt(1.5)

    mtf = meta_box.text_frame
    mtf.word_wrap = True
    mp1 = mtf.paragraphs[0]
    mp1.text = "PROJECT HIGHLIGHTS & LIVE DEPLOYMENT"
    mp1.font.name = "Arial"
    mp1.font.size = Pt(12)
    mp1.font.bold = True
    mp1.font.color.rgb = COLOR_AMBER

    items = [
        "Live Production URL:  https://nirajkanna043-wq.github.io/placement-assistant/",
        "Author / Presenter:  Niraj Kanna",
        "Key Subsystems:  NLP ATS Parser • Bayesian BKT Diagnostics • Calibrated ML Classifier • Voice Mock Interviewer • AST Big-O Sandbox • TPO Clustering",
        "Repository:  https://github.com/nirajkanna043-wq/placement-assistant"
    ]
    for it in items:
        p = mtf.add_paragraph()
        p.text = "• " + it
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(5)

    s1.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'Respected professors and evaluators, good morning. Today I am presenting Readiness, an AI-powered "
        "placement preparation and prediction platform. This capstone project integrates 7 distinct AI and Machine Learning "
        "methodologies to turn the stressful campus placement process into a transparent, explainable, and personalized experience. "
        "The application is completely deployed and live at nirajkanna043-wq.github.io/placement-assistant.'"
    )

    # -------------------------------------------------------------
    # SLIDE 2: Problem Statement & Motivation
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, COLOR_LIGHT_BG)
    add_header(s2, "Context & Challenges", "The Campus Recruitment Dilemma")

    # 3 Column Cards
    col_w = Inches(3.6)
    gap = Inches(0.4)
    c_y = Inches(1.8)
    c_h = Inches(4.8)

    # Card 1: ATS Rejection
    add_card(s2, Inches(0.8), c_y, col_w, c_h)
    tb = s2.shapes.add_textbox(Inches(0.95), c_y + Inches(0.15), col_w - Inches(0.3), c_h - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "1. The ATS Black Box"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_RUST

    pts1 = [
        "80%+ of campus resumes are rejected by Automated Applicant Tracking Systems (ATS) without human review.",
        "Students lack visibility into missing domain keywords, structural entity density, and recruiter screening weights.",
        "Result: High candidate anxiety and misaligned preparation effort."
    ]
    for pt in pts1:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(10)

    # Card 2: Static Assessments
    add_card(s2, Inches(0.8) + col_w + gap, c_y, col_w, c_h)
    tb = s2.shapes.add_textbox(Inches(0.95) + col_w + gap, c_y + Inches(0.15), col_w - Inches(0.3), c_h - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "2. Flawed Testing & Feedback"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER

    pts2 = [
        "Conventional placement portals use raw percentage scores that ignore lucky guesses or careless slips.",
        "No dynamic difficulty calibration — strong students get bored, while struggling candidates get demotivated.",
        "Zero explainability: candidates are never told which specific skill gap has the highest marginal ROI."
    ]
    for pt in pts2:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(10)

    # Card 3: Institutional Blindspots
    add_card(s2, Inches(0.8) + (col_w + gap) * 2, c_y, col_w, c_h)
    tb = s2.shapes.add_textbox(Inches(0.95) + (col_w + gap) * 2, c_y + Inches(0.15), col_w - Inches(0.3), c_h - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "3. Institutional Blindspots"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    pts3 = [
        "Placement Officers (TPOs) manage hundreds of students via static spreadsheets with no predictive foresight.",
        "At-risk students are discovered only after campus recruitment drives commence and offers are missed.",
        "Need: Automated ML cohort clustering and proactive intervention scheduling."
    ]
    for pt in pts3:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(10)

    s2.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'Every year, students face three massive bottlenecks: First, resumes get silently filtered out by automated ATS software. "
        "Second, mock tests give dumb percentages without accounting for lucky guesses or explaining where effort matters most. "
        "And third, college placement cells have zero predictive intelligence to rescue at-risk candidates before it's too late. "
        "Our system tackles all three challenges simultaneously.'"
    )

    # -------------------------------------------------------------
    # SLIDE 3: System Architecture & End-to-End Pipeline
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, COLOR_INK)
    add_header(s3, "Engineering Architecture", "End-to-End Multi-Modal AI Pipeline", is_dark=True)

    # 4 Architecture blocks
    bw = Inches(2.7)
    bg = Inches(0.3)
    by = Inches(1.8)
    bh = Inches(4.8)

    modules = [
        ("Phase 1: Input & Ingestion", COLOR_TEAL, [
            "NLP Resume Scanner",
            "N-Gram Tokenizer (1-3 words)",
            "Stop-word Removal & Normalization",
            "Domain Skill Taxonomy Mapping",
            "ATS Match Score Calculation"
        ]),
        ("Phase 2: Adaptive Testing", COLOR_AMBER, [
            "Bayesian Knowledge Tracing (BKT)",
            "Latent Mastery Model P(L)",
            "Slip (0.10) & Guess (0.25) Calibration",
            "Dynamic IRT Difficulty Routing",
            "Pedagogical AI Explanations"
        ]),
        ("Phase 3: Machine Learning & XAI", COLOR_RUST, [
            "Calibrated Logistic Classifier",
            "Multi-factor Sigmoid Activation",
            "SHAP Feature Attribution Waterfall",
            "What-If Sensitivity Simulator",
            "Tier-1 Benchmark Radar Map"
        ]),
        ("Phase 4: Simulators & Intel", COLOR_TEAL, [
            "AI Speech Mock Interview (TTS/STT)",
            "STAR Framework Rubric Scoring",
            "Static AST Code Complexity Engine",
            "Interactive ML Research Lab",
            "K-Means TPO Cohort Clustering"
        ])
    ]

    for i, (m_title, m_color, m_pts) in enumerate(modules):
        x = Inches(0.8) + i * (bw + bg)
        card = add_card(s3, x, by, bw, bh, bg_color=COLOR_PANEL, border_color=m_color)
        tb = s3.shapes.add_textbox(x + Inches(0.15), by + Inches(0.15), bw - Inches(0.3), bh - Inches(0.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = m_title
        p.font.name = "Georgia"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = m_color

        for pt in m_pts:
            p = tf.add_paragraph()
            p.text = "• " + pt
            p.font.name = "Arial"
            p.font.size = Pt(12)
            p.font.color.rgb = COLOR_WHITE
            p.space_before = Pt(8)

    s3.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'Here is the complete architectural pipeline. It is organized into four clean phases: "
        "Phase 1 uses NLP to extract entities from unstructured resumes. "
        "Phase 2 verifies skills using Bayesian Knowledge Tracing. "
        "Phase 3 runs our Logistic Classifier with Explainable AI attribution. "
        "And Phase 4 provides interactive practice with our Speech Interviewer, AST Code Evaluator, and TPO Clustering.'"
    )

    # -------------------------------------------------------------
    # SLIDE 4: Module 1 — NLP Resume Parser
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, COLOR_LIGHT_BG)
    add_header(s4, "Module 01: Information Extraction", "NLP Resume Parser & ATS Match Engine")

    # Left: Explanation
    lw = Inches(6.0)
    add_card(s4, Inches(0.8), Inches(1.8), lw, Inches(4.8))
    tb = s4.shapes.add_textbox(Inches(1.0), Inches(2.0), lw - Inches(0.4), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Text Processing & Ontology Matching"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    pts = [
        "Unigram, Bigram, Trigram extraction: Captures complex terms like 'Dynamic Programming', 'System Design', and 'REST API'.",
        "Stop-word filtering & morphological sanitization.",
        "Entity verification against 15+ curated domain role taxonomies (SDE, Data Analyst, Frontend Engineer).",
        "Keyword density weighting: Rewards contextual depth over superficial keyword stuffing."
    ]
    for pt in pts:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(8)

    # Right: Formula & Benchmark card
    rw = Inches(5.3)
    rx = Inches(7.2)
    add_card(s4, rx, Inches(1.8), rw, Inches(4.8), bg_color=COLOR_INK, border_color=COLOR_AMBER)
    tb = s4.shapes.add_textbox(rx + Inches(0.25), Inches(2.0), rw - Inches(0.5), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Mathematical Confidence Formulation"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER

    f_p = tf.add_paragraph()
    f_p.text = "Confidence = min(95, 35 + (Hits × 18) + (Density × 4) + MultiwordBonus)"
    f_p.font.name = "Courier New"
    f_p.font.size = Pt(12)
    f_p.font.bold = True
    f_p.font.color.rgb = COLOR_WHITE
    f_p.space_before = Pt(12)

    f_p2 = tf.add_paragraph()
    f_p2.text = "ATS_Score = ( Σ [Matched_i / 100 × Weight_i] ) / Total_Role_Weight × 100"
    f_p2.font.name = "Courier New"
    f_p2.font.size = Pt(12)
    f_p2.font.bold = True
    f_p2.font.color.rgb = COLOR_AMBER
    f_p2.space_before = Pt(10)

    p = tf.add_paragraph()
    p.text = "\nKey Benefits for Candidates:"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE

    p = tf.add_paragraph()
    p.text = "1. Immediate detection of missing high-yield keywords before submitting applications.\n2. Automatic population of skill sliders, eliminating subjective user bias.\n3. Built-in 1-click benchmark resumes for viva & testing."
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.color.rgb = COLOR_MUTED
    p.space_before = Pt(6)

    s4.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'In Module 1, our NLP engine ingests raw resume text. By generating 1-to-3-word n-grams, it avoids "
        "the common pitfall of naive keyword searches — recognizing 'System Design' or 'Binary Search Tree' as coherent entities. "
        "It applies our mathematical density formula to score ATS readiness and auto-populate the candidate's initial profile.'"
    )

    # -------------------------------------------------------------
    # SLIDE 5: Module 2 — Bayesian Knowledge Tracing
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, COLOR_LIGHT_BG)
    add_header(s5, "Module 02: Adaptive Assessment", "Bayesian Knowledge Tracing (BKT) & IRT")

    # Left: The Model
    add_card(s5, Inches(0.8), Inches(1.8), lw, Inches(4.8))
    tb = s5.shapes.add_textbox(Inches(1.0), Inches(2.0), lw - Inches(0.4), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Why Standard Quizzes Fail"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_RUST

    pts = [
        "A candidate answering 3/4 correctly may simply be a lucky guesser (25% guess probability on 4 options).",
        "A candidate missing a question may know the concept perfectly but made a minor typo (slip error).",
        "Bayesian Knowledge Tracing isolates these phenomena mathematically by treating skill mastery as a latent hidden variable P(L_t)."
    ]
    for pt in pts:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(8)

    # Right: Formula
    add_card(s5, rx, Inches(1.8), rw, Inches(4.8), bg_color=COLOR_PANEL, border_color=COLOR_TEAL)
    tb = s5.shapes.add_textbox(rx + Inches(0.25), Inches(2.0), rw - Inches(0.5), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Bayesian Posterior Equations"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE

    p = tf.add_paragraph()
    p.text = "P(L_t | Correct) = [ P(L) · (1 - S) ] / [ P(L)·(1 - S) + (1 - P(L))·G ]"
    p.font.name = "Courier New"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER
    p.space_before = Pt(10)

    p = tf.add_paragraph()
    p.text = "P(L_t | Incorrect) = [ P(L) · S ] / [ P(L)·S + (1 - P(L))·(1 - G) ]"
    p.font.name = "Courier New"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER
    p.space_before = Pt(8)

    p = tf.add_paragraph()
    p.text = "Next_Belief P(L_{t+1}) = Posterior + (1 - Posterior) · LearningRate"
    p.font.name = "Courier New"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p.space_before = Pt(8)

    p = tf.add_paragraph()
    p.text = "\nParameters Calibrated:\n• Slip Probability (S) = 0.10\n• Guess Probability (G) = 0.25\n• Learning Transition Rate (T) = 0.15\n• Item Response Theory (IRT): Easy, Medium & Hard branching."
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.color.rgb = COLOR_MUTED
    p.space_before = Pt(10)

    s5.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'Module 2 implements Bayesian Knowledge Tracing. Standard portals simply calculate correct answers over total questions. "
        "In contrast, BKT models the student's true latent mastery state. If an expert student makes a careless mistake, the model "
        "accounts for slip probability. If a novice guesses correctly, the model suppresses false inflation. This gives an authentic "
        "foundation for placement prediction.'"
    )

    # -------------------------------------------------------------
    # SLIDE 6: Module 3 — ML Classifier & Explainable AI (XAI)
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, COLOR_LIGHT_BG)
    add_header(s6, "Module 03: Machine Learning & XAI", "Calibrated Placement Classifier & SHAP Waterfall")

    add_card(s6, Inches(0.8), Inches(1.8), lw, Inches(4.8))
    tb = s6.shapes.add_textbox(Inches(1.0), Inches(2.0), lw - Inches(0.4), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Calibrated Logistic Regression"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    p = tf.add_paragraph()
    p.text = "P(Offer) = σ(z) = 1 / (1 + e^-z)"
    p.font.name = "Courier New"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_INK
    p.space_before = Pt(8)

    pts = [
        "Features: Normalized Skill Coverage (x1), BKT Quiz Mastery (x2), Roadmap Pace (x3), Mock Interview Score (x4), and ATS Match (x5).",
        "Bias threshold (β0 = -2.35) represents the competitive campus cutoff.",
        "Calibrated against real-world campus recruitment benchmarks."
    ]
    for pt in pts:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(8)

    # Right: SHAP XAI & What-If
    add_card(s6, rx, Inches(1.8), rw, Inches(4.8), bg_color=COLOR_CARD_BG, border_color=COLOR_AMBER)
    tb = s6.shapes.add_textbox(rx + Inches(0.25), Inches(2.0), rw - Inches(0.5), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Explainable AI (SHAP Waterfall)"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_RUST

    p = tf.add_paragraph()
    p.text = "SHAP Attribution φ_i = w_i · (x_i - x_mean_i)"
    p.font.name = "Courier New"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_INK
    p.space_before = Pt(8)

    pts2 = [
        "Positive Drivers (+): Clearly surfaces competencies boosting candidate selection odds (+18% DSA, +12% Quiz).",
        "Risk Detractors (-): Highlights exact vulnerabilities penalizing candidate odds (-14% System Design gap).",
        "Interactive 'What-If' Simulator: Lets candidates slide any skill level to calculate exact marginal probability gain (e.g. +11% by mastering SQL)."
    ]
    for pt in pts2:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(6)

    s6.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'In Module 3, our predictive engine solves the black-box dilemma. Deep neural networks cannot explain why they rejected someone. "
        "Our calibrated Logistic model pairs with a SHAP-style Explainable AI waterfall. It tells the student: you have a 76% offer chance, "
        "driven up by DSA, but dragged down by System Design. Then our What-If simulator shows exactly how much their odds will rise if they close that gap.'"
    )

    # -------------------------------------------------------------
    # SLIDE 7: Module 4 — Speech AI Mock Interview
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, COLOR_LIGHT_BG)
    add_header(s7, "Module 04: Voice & Conversational AI", "AI Speech Mock Interviewer & STAR Rubric")

    add_card(s7, Inches(0.8), Inches(1.8), lw, Inches(4.8))
    tb = s7.shapes.add_textbox(Inches(1.0), Inches(2.0), lw - Inches(0.4), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Multi-Modal Voice Engine"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    pts = [
        "Text-to-Speech (TTS): Uses Web SpeechSynthesis to vocalize authentic interviewer questions with natural cadence.",
        "Speech-to-Text (STT): Web SpeechRecognition captures live microphone audio, streaming real-time transcription.",
        "Zero-latency edge execution: Runs completely in browser with no paid external audio servers required."
    ]
    for pt in pts:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(10)

    add_card(s7, rx, Inches(1.8), rw, Inches(4.8), bg_color=COLOR_PANEL, border_color=COLOR_AMBER)
    tb = s7.shapes.add_textbox(rx + Inches(0.25), Inches(2.0), rw - Inches(0.5), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Live Fluency & STAR Rubric Scoring"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER

    pts2 = [
        "Words Per Minute (WPM) tracking: Evaluates speech pace against standard 120-150 WPM interview cadence.",
        "Filler Word Detection: Counts hesitations ('um', 'uh', 'like', 'basically', 'actually').",
        "STAR Methodology Evaluator: Analyzes answer structure for Situation, Task, Action, and Quantifiable Result.",
        "Gold Standard Exemplar: Provides a benchmark 100/100 model answer for candidate study."
    ]
    for pt in pts2:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(8)

    s7.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'Module 4 bridges technical knowledge with verbal presentation. Using the Web Speech API, our AI interviewer speaks aloud. "
        "The student speaks back into the microphone. Our NLP rubric instantly analyzes Words-Per-Minute, counts filler words like 'um' and 'basically', "
        "and checks whether the response follows the STAR framework. This provides instant interview feedback before candidates face real recruiters.'"
    )

    # -------------------------------------------------------------
    # SLIDE 8: Module 5 — AI Code Sandbox (AST Big-O)
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, COLOR_LIGHT_BG)
    add_header(s8, "Module 05: Algorithmic Verification", "AI Code Sandbox & Static AST Big-O Engine")

    add_card(s8, Inches(0.8), Inches(1.8), lw, Inches(4.8))
    tb = s8.shapes.add_textbox(Inches(1.0), Inches(2.0), lw - Inches(0.4), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Static AST Complexity Deduction"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    pts = [
        "Loop Nesting Depth Inspection: Identifies interdependent iterative loops to flag O(n^2) quadratic bottlenecks.",
        "Hash Map & Set Recognition: Automatically identifies auxiliary hash table allocations achieving optimal O(1) lookup time.",
        "Recursion Pattern Analysis: Detects unmemoized recursive branching with exponential O(2^n) risks."
    ]
    for pt in pts:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(10)

    add_card(s8, rx, Inches(1.8), rw, Inches(4.8), bg_color=COLOR_INK, border_color=COLOR_TEAL)
    tb = s8.shapes.add_textbox(rx + Inches(0.25), Inches(2.0), rw - Inches(0.5), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Defensive Engineering & Solutions"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE

    pts2 = [
        "Edge Case Resilience: Checks for defensive guard clauses, empty array handles, null safety, and parity constraints.",
        "Production Code Quality Score: Blends time complexity, auxiliary space, and defensive programming into a 0-100 score.",
        "Side-by-side Gold Standard: Compares student code against an optimal production refactoring."
    ]
    for pt in pts2:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_MUTED
        p.space_before = Pt(10)

    s8.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'In Module 5, candidates practice live coding. Rather than running slow server-side sandboxes with timeout vulnerabilities, "
        "we use Static Abstract Syntax Tree (AST) inspection. It examines loop nesting depth and data structure allocations to deduce Big-O "
        "asymptotic bounds — flagging quadratic O(n^2) code and showing how a Hash Map achieves optimal O(n) performance.'"
    )

    # -------------------------------------------------------------
    # SLIDE 9: Module 6 — Interactive ML Research Lab
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, COLOR_INK)
    add_header(s9, "Module 06: Academic Research", "Interactive ML Lab & Decision Hyperplane", is_dark=True)

    add_card(s9, Inches(0.8), Inches(1.8), lw, Inches(4.8), bg_color=COLOR_PANEL, border_color=COLOR_AMBER)
    tb = s9.shapes.add_textbox(Inches(1.0), Inches(2.0), lw - Inches(0.4), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Live Forward-Pass Perceptron"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER

    pts = [
        "Live Dot Product Computation: z = β0 + Σ (w_i · x_i).",
        "Interactive Synaptic Sliders: Modify input features and synaptic weights live in the browser.",
        "Sigmoid Activation Firing: Observes the mathematical probability σ(z) recalculate continuously."
    ]
    for pt in pts:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(10)

    add_card(s9, rx, Inches(1.8), rw, Inches(4.8), bg_color=COLOR_PANEL, border_color=COLOR_TEAL)
    tb = s9.shapes.add_textbox(rx + Inches(0.25), Inches(2.0), rw - Inches(0.5), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "2D Decision Space & Loss Curve"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    pts2 = [
        "2D Scatter Plot: Maps candidate coordinates across Technical Coverage vs. Interview Performance.",
        "Separating Decision Boundary: Demonstrates the linear hyperplane separating 'Placed' vs. 'At-Risk' candidates.",
        "Your Live Position: Highlights candidate's current vector in the decision space.",
        "Loss Minimization: Plots Binary Cross-Entropy loss convergence across 50 gradient descent training epochs (94.2% accuracy)."
    ]
    for pt in pts2:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(8)

    s9.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'Module 6 is our Interactive Machine Learning Research Lab. Evaluators can directly adjust synaptic weights and threshold biases "
        "to see how the Perceptron fires. We plot candidate vectors on a 2D decision boundary scatter plot and display our binary cross-entropy "
        "training loss curve. This provides complete mathematical transparency for project viva defense.'"
    )

    # -------------------------------------------------------------
    # SLIDE 10: Module 7 — TPO Batch Intelligence & K-Means
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, COLOR_LIGHT_BG)
    add_header(s10, "Module 07: Institutional Intelligence", "TPO Batch Analytics & K-Means Cohort Clustering")

    # 4 Cluster Cards
    cw = Inches(5.6)
    ch = Inches(2.25)
    cy1 = Inches(1.8)
    cy2 = Inches(4.35)

    # Cluster 1
    add_card(s10, Inches(0.8), cy1, cw, ch)
    tb = s10.shapes.add_textbox(Inches(0.95), cy1 + Inches(0.1), cw - Inches(0.3), ch - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Cluster 1: Direct Placement Ready (≥ 75%)"
    p.font.name = "Georgia"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL
    p = tf.add_paragraph()
    p.text = "High technical coverage and proven interview readiness.\n• Action: Fast-track to product company interview rounds; schedule advanced mock interviews."
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.space_before = Pt(4)

    # Cluster 2
    add_card(s10, Inches(6.8), cy1, cw, ch)
    tb = s10.shapes.add_textbox(Inches(6.95), cy1 + Inches(0.1), cw - Inches(0.3), ch - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Cluster 2: Core Tech Deficit (55% - 74%)"
    p.font.name = "Georgia"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER
    p = tf.add_paragraph()
    p.text = "Strong fundamentals but lacking high-weight domain skills (DSA/System Design).\n• Action: Conduct intensive 2-week coding sprint focused on top weighted gaps."
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.space_before = Pt(4)

    # Cluster 3
    add_card(s10, Inches(0.8), cy2, cw, ch)
    tb = s10.shapes.add_textbox(Inches(0.95), cy2 + Inches(0.1), cw - Inches(0.3), ch - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Cluster 3: Assessment Gap (45% - 54%)"
    p.font.name = "Georgia"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = COLOR_RUST
    p = tf.add_paragraph()
    p.text = "Moderate self-ratings but low quiz accuracy or uncompleted roadmap milestones.\n• Action: Mandate weekly timed diagnostic quizzes and verified coding submissions."
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.space_before = Pt(4)

    # Cluster 4
    add_card(s10, Inches(6.8), cy2, cw, ch)
    tb = s10.shapes.add_textbox(Inches(6.95), cy2 + Inches(0.1), cw - Inches(0.3), ch - Inches(0.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Cluster 4: At-Risk Placement (< 45%)"
    p.font.name = "Georgia"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = COLOR_INK
    p = tf.add_paragraph()
    p.text = "Severe skill deficits; high risk of missing early placement drives.\n• Action: Immediate 1-on-1 faculty counselling and remedial foundations bootcamp."
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.space_before = Pt(4)

    s10.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'Module 7 empowers college Training & Placement Officers. By applying Unsupervised K-Means Clustering across the entire student cohort, "
        "the dashboard segments students into 4 actionable personas. More importantly, it generates concrete institutional interventions — telling "
        "administrators exactly which bootcamp will yield the highest statistical conversion rate.'"
    )

    # -------------------------------------------------------------
    # SLIDE 11: Radar Map & Placement Audit Dossier
    # -------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, COLOR_LIGHT_BG)
    add_header(s11, "Validation & Certification", "Competency Radar Map & Placement Audit Dossier")

    add_card(s11, Inches(0.8), Inches(1.8), lw, Inches(4.8))
    tb = s11.shapes.add_textbox(Inches(1.0), Inches(2.0), lw - Inches(0.4), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Competency Radar Map"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    pts = [
        "Multi-dimensional spatial visualization across core recruitment axes.",
        "Direct visual benchmark against the Tier-1 / FAANG placement bar (80%).",
        "Instantly highlights balance between programming, system architecture, database queries, and aptitude."
    ]
    for pt in pts:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(10)

    add_card(s11, rx, Inches(1.8), rw, Inches(4.8), bg_color=COLOR_CARD_BG, border_color=COLOR_INK)
    tb = s11.shapes.add_textbox(rx + Inches(0.25), Inches(2.0), rw - Inches(0.5), Inches(4.4))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Official Placement Dossier & Cert"
    p.font.name = "Georgia"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_INK

    pts2 = [
        "1-Click Printable Placement Certification: Formally verifies student readiness score and predicted candidate tier.",
        "Full Competency & BKT Breakdown: Itemizes verified scores against role standards.",
        "Cryptographic Verification Hash: Includes model hash (SHA-256) authenticating calculation integrity."
    ]
    for pt in pts2:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_INK
        p.space_before = Pt(10)

    s11.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'Finally, candidates receive a multi-dimensional Competency Radar Map and can export an official Placement Audit Dossier. "
        "This dossier functions as a verifiable certificate of placement readiness, complete with a model cryptographic hash.'"
    )

    # -------------------------------------------------------------
    # SLIDE 12: Conclusion & Summary
    # -------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, COLOR_INK)
    add_header(s12, "Summary & Impact", "Conclusion & Key Project Contributions", is_dark=True)

    c_box = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.8))
    c_box.fill.solid()
    c_box.fill.fore_color.rgb = COLOR_PANEL
    c_box.line.color.rgb = COLOR_AMBER
    c_box.line.width = Pt(1.5)

    tf = c_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "KEY TAKEAWAYS"
    p.font.name = "Georgia"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_AMBER

    pts = [
        "End-to-End AI Integration: Successfully combines NLP, Bayesian Knowledge Tracing, Supervised Classification, Explainable AI (XAI), Speech Analytics, and Static AST Analysis.",
        "100% Autonomous Edge Execution: Runs zero-latency in the browser with zero cloud server cost, while supporting optional Gemini LLM integration.",
        "Explainability Over Black-Boxes: Provides candidates and professors with transparent mathematical attribution for every recommendation.",
        "Institutional Value: Bridges the gap between candidate self-study and university placement administrative oversight.",
        "Live Website Deployment: Fully functional and publicly accessible at https://nirajkanna043-wq.github.io/placement-assistant/"
    ]
    for pt in pts:
        p = tf.add_paragraph()
        p.text = "✓ " + pt
        p.font.name = "Arial"
        p.font.size = Pt(14)
        p.font.color.rgb = COLOR_WHITE
        p.space_before = Pt(12)

    s12.notes_slide.notes_text_frame.text = (
        "Presenter Script:\n"
        "'In conclusion, Readiness proves that applying AI to placement preparation doesn't require opaque black boxes or expensive servers. "
        "By grounding our system in sound NLP, Bayesian inference, and Explainable AI, we give students actionable clarity and give universities "
        "actionable cohort intelligence. The application is live today. Thank you, and I look forward to your questions.'"
    )

    output_path = "C:/Users/niraj/Downloads/placement-assistant/placement-assistant/placement_assistant_presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_deck()
