import os
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def create_prototype_deck(filename="KSP_AI_Crime_Intelligence_Prototype_Deck.pdf"):
    # Target file path
    doc = SimpleDocTemplate(
        filename,
        pagesize=landscape(letter),
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=30,
        leading=36,
        textColor=colors.HexColor('#0F172A'),
        alignment=TA_CENTER
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=15,
        leading=22,
        textColor=colors.HexColor('#2563EB'),
        alignment=TA_CENTER
    )

    slide_title_style = ParagraphStyle(
        'SlideTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#1E3A8A'),
        spaceAfter=12
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=18,
        textColor=colors.HexColor('#334155')
    )

    bold_body = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=colors.HexColor('#0F172A')
    )

    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#FFFFFF'),
        alignment=TA_CENTER
    )

    story = []

    # ==================== SLIDE 1: COVER ====================
    story.append(Spacer(1, 40))
    story.append(Paragraph("🛡️ KARNATAKA STATE POLICE", subtitle_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph("AI-Powered Unified Crime Intelligence & Governance Platform", title_style))
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="80%", thickness=3, color=colors.HexColor('#2563EB'), spaceAfter=20))
    story.append(Paragraph("<b>Datathon 2026 Prototype Pitch Deck</b><br/>Team Submission | Public Repository & Prototype Presentation", subtitle_style))
    story.append(Spacer(1, 40))
    
    meta_data = [
        [Paragraph("<b>Submitted for:</b> Karnataka State Police Datathon 2026", body_style),
         Paragraph("<b>Deployment:</b> Catalyst / Cloud Ready", body_style)],
        [Paragraph("<b>GitHub Repository:</b> github.com/aswinpalraj77-coder/project", body_style),
         Paragraph("<b>Tech Stack:</b> React 18, TypeScript, Tailwind, Leaflet", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[360, 360])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(PageBreak())

    # ==================== SLIDE 2: THE PROBLEM & VISION ====================
    story.append(Paragraph("1. Problem Statement & Strategic Vision", slide_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=15))
    
    p_content = [
        [Paragraph("<b>Current Police Tech Challenges:</b>", bold_body), Paragraph("<b>Our AI-Driven Solution:</b>", bold_body)],
        [
            Paragraph("• Fragmented FIR record management across police stations.<br/>"
                      "• Manual analysis of crime patterns causing delayed response.<br/>"
                      "• Lack of real-time geospatial intelligence for patrol officers.<br/>"
                      "• High barrier for citizens to file e-FIRs and track status.<br/>"
                      "• Information silos between stations hindering link analysis.", body_style),
            Paragraph("• <b>Unified Multi-Portal Architecture</b> (Officer, Citizen, Admin).<br/>"
                      "• <b>AI Copilot & FIR Search</b>: Plain-language queries on crime history.<br/>"
                      "• <b>Geospatial Hotspot Analytics</b> powered by interactive maps.<br/>"
                      "• <b>Instant Citizen e-FIR & Emergency SOS</b> with live GPS dispatch.<br/>"
                      "• <b>Criminal Link Graphs</b> to visualize co-accused networks.", body_style)
        ]
    ]
    t_prob = Table(p_content, colWidths=[350, 370])
    t_prob.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#FEF2F2')),
        ('BACKGROUND', (1,0), (1,-1), colors.HexColor('#F0FDF4')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('BOX', (0,0), (0,-1), 1, colors.HexColor('#FECACA')),
        ('BOX', (1,0), (1,-1), 1, colors.HexColor('#BBF7D0')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_prob)
    story.append(PageBreak())

    # ==================== SLIDE 3: PORTAL ARCHITECTURE ====================
    story.append(Paragraph("2. Core Modules & Portals Overview", slide_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=15))

    portal_data = [
        [Paragraph("<b>👮 Officer Portal</b>", bold_body), Paragraph("<b>🏛️ Citizen Portal</b>", bold_body), Paragraph("<b>⚙️ Admin Portal</b>", bold_body)],
        [
            Paragraph("• AI FIR Natural Language Search<br/>"
                      "• Automated Case Summarizer<br/>"
                      "• Predictive Hotspot Maps<br/>"
                      "• Criminal Link Networks<br/>"
                      "• Shift Handover Copilot", body_style),
            Paragraph("• AI-Guided e-FIR Filing<br/>"
                      "• Real-Time Complaint Tracker<br/>"
                      "• One-Tap Emergency SOS<br/>"
                      "• Cybercrime Reporting Hub<br/>"
                      "• Public Safety Chatbot", body_style),
            Paragraph("• Role-Based Access Control<br/>"
                      "• Station Hierarchy Setup<br/>"
                      "• AI Accuracy & Audit Logs<br/>"
                      "• System Performance Analytics<br/>"
                      "• Token & Cost Monitoring", body_style)
        ]
    ]
    t_port = Table(portal_data, colWidths=[240, 240, 240])
    t_port.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#EFF6FF')),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#F5F3FF')),
        ('BACKGROUND', (2,0), (2,0), colors.HexColor('#FFF7ED')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_port)
    story.append(PageBreak())

    # ==================== SLIDE 4: TECH STACK & FEASIBILITY ====================
    story.append(Paragraph("3. Technology Stack & Deployment Architecture", slide_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=15))

    tech_data = [
        [Paragraph("<b>Layer</b>", bold_body), Paragraph("<b>Technologies Used</b>", bold_body), Paragraph("<b>Key Advantages</b>", bold_body)],
        [Paragraph("Frontend UI", body_style), Paragraph("React 18, TypeScript, Vite, Tailwind CSS", body_style), Paragraph("Lightning fast load time (< 1s), highly responsive UI", body_style)],
        [Paragraph("Maps & GIS", body_style), Paragraph("Leaflet, React-Leaflet, OpenStreetMap", body_style), Paragraph("Interactive crime hotspot visualization with zero tile latency", body_style)],
        [Paragraph("AI & Search", body_style), Paragraph("Natural Language Query Parser, Contextual AI", body_style), Paragraph("Translates officer prompts into instant structured FIR data", body_style)],
        [Paragraph("Security & Auth", body_style), Paragraph("Role-Based Access Control (RBAC), Supabase Client", body_style), Paragraph("Encrypted police data access & audited log tracking", body_style)],
        [Paragraph("Deployment", body_style), Paragraph("Zoho Catalyst / Vercel / Cloud Native", body_style), Paragraph("Scalable serverless infrastructure ready for KSP deployment", body_style)]
    ]
    t_tech = Table(tech_data, colWidths=[130, 290, 300])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('PADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    # Adjust table text color for header
    for i in range(3):
        t_tech._cellvalues[0][i] = Paragraph(f"<font color='white'><b>{['Layer', 'Technologies Used', 'Key Advantages'][i]}</b></font>", bold_body)
    
    story.append(t_tech)
    story.append(PageBreak())

    # ==================== SLIDE 5: IMPACT & SUMMARY ====================
    story.append(Paragraph("4. Expected Impact & Submission Summary", slide_title_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=15))

    impact_data = [
        [Paragraph("<b>🎯 For Police Officers</b>", bold_body), Paragraph("<b>🤝 For Citizens</b>", bold_body)],
        [
            Paragraph("• 70% reduction in time spent writing daily crime reports.<br/>"
                      "• Instant cross-station suspect link detection.<br/>"
                      "• Data-backed proactive patrol deployment in hotspots.", body_style),
            Paragraph("• 24/7 accessible e-FIR filing without station visits.<br/>"
                      "• Transparent real-time complaint tracking.<br/>"
                      "• Instant emergency response triggering via SOS dispatch.", body_style)
        ]
    ]
    t_imp = Table(impact_data, colWidths=[360, 360])
    t_imp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_imp)
    story.append(Spacer(1, 20))

    summary_box = [
        [Paragraph("<b>🚀 Submission Links Summary:</b><br/>"
                   "• <b>GitHub Repository:</b> <font color='#2563EB'><u>https://github.com/aswinpalraj77-coder/project</u></font><br/>"
                   "• <b>Prototype Status:</b> Fully Committed, Built & Production-Ready<br/>"
                   "• <b>Hackathon:</b> Karnataka State Police Datathon 2026", body_style)]
    ]
    t_sum = Table(summary_box, colWidths=[720])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EFF6FF')),
        ('PADDING', (0,0), (-1,-1), 14),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#2563EB')),
    ]))
    story.append(t_sum)

    doc.build(story)
    print("PDF generated successfully:", filename)

if __name__ == "__main__":
    create_prototype_deck()
