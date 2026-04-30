import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { FRONT_PARTS, BACK_PARTS, BODY_SILHOUETTE_PATH } from '../components/dashboard/AnatomyMap';

export const generateAssessmentPDF = async (patient: any) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const page = pdfDoc.addPage([595, 842]); // A4 Size
  const { width, height } = page.getSize();
  const fontSize = 10;
  const margin = 50;
  let activePage = page;
  let currentY = height - 160; // Pushed down further to avoid header overlap

  // Helper to draw text
  const drawText = (text: string, x: number, y: number, font = timesRomanFont, size = fontSize, pg = activePage) => {
    pg.drawText(text || '', { x, y, size, font, color: rgb(0.1, 0.1, 0.1) });
  };

  // Helper for Table Rows (Column Layout with Borders)
  const drawRow = (label: string, value: string, y: number, isSubHeader = false) => {
    const rowHeight = 25;
    const col1Width = 180;
    
    // Page Break Logic
    if (y < 80) {
      activePage = pdfDoc.addPage([595, 842]);
      y = 800;
      // Re-draw initial border if new page
      activePage.drawLine({ start: { x: margin, y: y + 20 }, end: { x: width - margin, y: y + 20 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
    }

    // Row Backgrounds
    activePage.drawRectangle({ x: margin, y: y - 5, width: width - (margin * 2), height: rowHeight, color: isSubHeader ? rgb(0.92, 0.95, 0.95) : rgb(1,1,1) });
    activePage.drawRectangle({ x: margin, y: y - 5, width: col1Width, height: rowHeight, color: rgb(0.97, 0.98, 0.99) });
    
    // Grid Lines (Vertical)
    const lineYStart = y - 5;
    const lineYEnd = y + 20;
    activePage.drawLine({ start: { x: margin, y: lineYStart }, end: { x: margin, y: lineYEnd }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
    activePage.drawLine({ start: { x: margin + col1Width, y: lineYStart }, end: { x: margin + col1Width, y: lineYEnd }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
    activePage.drawLine({ start: { x: width - margin, y: lineYStart }, end: { x: width - margin, y: lineYEnd }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
    
    // Grid Line (Horizontal Bottom)
    activePage.drawLine({ start: { x: margin, y: lineYStart }, end: { x: width - margin, y: lineYStart }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });

    // Cell Text
    activePage.drawText((label || '').toUpperCase(), { x: margin + 10, y: y + 5, size: 7.5, font: timesBoldFont, color: rgb(0.2, 0.3, 0.3) });
    
    const cleanValue = String(value || 'N/A');
    activePage.drawText(cleanValue.substring(0, 75), { x: margin + col1Width + 10, y: y + 5, size: 9, font: timesRomanFont, color: rgb(0.1, 0.1, 0.1) });
    
    return y - rowHeight;
  };

  // Section Header Helper
  const drawSectionHeader = (title: string, y: number) => {
    if (y < 120) {
      activePage = pdfDoc.addPage([595, 842]);
      y = 800;
    }
    activePage.drawRectangle({ x: margin, y: y - 5, width: width - (margin * 2), height: 22, color: rgb(0.35, 0.7, 0.7) });
    activePage.drawText(title, { x: margin + 10, y: y, size: 10, font: timesBoldFont, color: rgb(1,1,1) });
    
    // Initial border for the first row under this header
    activePage.drawLine({ start: { x: margin, y: y - 5 }, end: { x: width - margin, y: y - 5 }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
    
    return y - 27;
  };

  // Header Section
  activePage.drawRectangle({
    x: 0,
    y: height - 80,
    width: width,
    height: 80,
    color: rgb(0.1, 0.2, 0.2), // Dark Slate
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  // Logo Embedding
  try {
    const logoResponse = await fetch('/h2f_log_cropped.jpeg');
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedJpg(logoBytes);
    activePage.drawImage(logoImage, {
      x: margin,
      y: height - 60,
      width: 100,
      height: 40,
    });
  } catch (e) {
    console.warn("Logo not found, proceeding without logo branding.");
  }

  activePage.drawText('CLINICAL ASSESSMENT REPORT', { x: margin + 110, y: height - 42, size: 14, font: timesBoldFont, color: rgb(1,1,1) });
  activePage.drawText(`Generated: ${dateStr} | ${timeStr}`, { 
    x: width - margin - 140, 
    y: height - 42, 
    size: 7, 
    font: timesBoldFont, 
    color: rgb(0.8, 0.8, 0.8) 
  });
  activePage.drawText('Physiotherapy & Rehabilitation Center', { x: margin + 50, y: height - 56, size: 8, font: timesRomanFont, color: rgb(0.6, 0.6, 0.6) });

  const data = patient.assessmentData || {};

  // --- PELVIC FLOOR ASSESSMENT BRANCH ---
  if (patient.assessmentType === 'PELVIC_FLOOR') {
    activePage.drawText('PELVIC FLOOR REHABILITATION REPORT', { x: margin, y: currentY + 40, size: 12, font: timesBoldFont, color: rgb(0.2, 0.3, 0.3) });
    
    // Administrative
    currentY = drawSectionHeader('ADMINISTRATIVE DETAILS', currentY);
    currentY = drawRow('Full Name', patient.name, currentY);
    currentY = drawRow('Patient ID', `H2F-${patient.pid || patient.id}`, currentY);
    currentY = drawRow('Branch', patient.branch, currentY);
    currentY -= 10;

    // 1. SUBJECTIVE
    currentY = drawSectionHeader('1. SUBJECTIVE ASSESSMENT & HISTORY', currentY);
    const sub = data.subjective || {};
    currentY = drawRow('Chief Complaint', sub.chiefComplaint, currentY);
    currentY = drawRow('Progression', sub.progression, currentY);
    currentY = drawRow('Onset / Duration', `${sub.onset || 'N/A'} / ${sub.duration || 'N/A'}`, currentY);
    currentY = drawRow('Pain Quality', sub.qualityOfPain, currentY);
    currentY = drawRow('Intensity', `${sub.intensity || 0} / 10`, currentY);
    currentY = drawRow('Location', sub.location, currentY);
    currentY = drawRow('Aggravating Factor', sub.aggravatingFactor, currentY);
    currentY = drawRow('Easing Factor', sub.easingFactor, currentY);
    
    // Red Flags
    currentY = drawRow('--- RED FLAGS ---', '', currentY, true);
    const rf = data.redFlags || {};
    currentY = drawRow('Infection / Weight Loss', `${rf.infection || 'N/A'} / ${rf.weightLoss || 'N/A'}`, currentY);
    currentY = drawRow('Bleeding / Discharge', `${rf.bleeding || 'N/A'} / ${rf.vaginalDischarge || 'N/A'}`, currentY);
    currentY -= 10;

    // 2. FUNCTIONS
    currentY = drawSectionHeader('2. BLADDER, BOWEL & SEXUAL FUNCTION', currentY);
    const func = data.functions || {};
    currentY = drawRow('Bladder (Freq/Urg)', `${func.bladder?.frequency || 'N/A'} / ${func.bladder?.urgency || 'N/A'}`, currentY);
    currentY = drawRow('Bladder (Inc/Noct/Pads)', `${func.bladder?.incontinence || 'N/A'} / ${func.bladder?.nocturia || 'N/A'} / ${func.bladder?.pads || 'N/A'}`, currentY);
    currentY = drawRow('Bowel (Freq/Cons)', `${func.bowel?.frequency || 'N/A'} / ${func.bowel?.consistency || 'N/A'}`, currentY);
    currentY = drawRow('Bowel (Strain/Inc/Const)', `${func.bowel?.straining || 'N/A'} / ${func.bowel?.incontinence || 'N/A'} / ${func.bowel?.constipation || 'N/A'}`, currentY);
    currentY = drawRow('Sexual (Pain/Orgasm)', `${func.sexual?.dyspareunia || 'N/A'} / ${func.sexual?.orgasm || 'N/A'}`, currentY);
    currentY = drawRow('Sexual (Lubric/Moist)', `${func.sexual?.lubricant || 'N/A'} / ${func.sexual?.moisturizer || 'N/A'}`, currentY);
    currentY = drawRow('Functional (ADL/Work)', `${func.functional?.adls || 'N/A'} / ${func.functional?.work || 'N/A'}`, currentY);
    currentY = drawRow('Func (Lift/Sit/Walk)', `${func.functional?.lifting || 'N/A'} / ${func.functional?.sitting || 'N/A'} / ${func.functional?.walking || 'N/A'}`, currentY);
    currentY -= 10;

    // 3. OBJECTIVE
    currentY = drawSectionHeader('3. OBJECTIVE & EXAMINATION', currentY);
    const obj = data.objective || {};
    currentY = drawRow('Postural (Lord/Pelv)', `${obj.postural?.lumbarLordosis || 'N/A'} / ${obj.postural?.pelvicAlignment || 'N/A'}`, currentY);
    currentY = drawRow('Breathing (Patt/Mob)', `${obj.postural?.breathingPattern || 'N/A'} / ${obj.breathing?.diaphragmMobility || 'N/A'}`, currentY);
    currentY = drawRow('Lumbar / Hip ROM', `${obj.musculoskeletal?.lumbarRom || 'N/A'} / ${obj.musculoskeletal?.hipRom || 'N/A'}`, currentY);
    currentY = drawRow('Core / Abdom Active', `${obj.musculoskeletal?.coreStrength || 'N/A'} / ${obj.musculoskeletal?.abdominalActivation || 'N/A'}`, currentY);
    currentY = drawRow('Diastasis / Pudendal', `${obj.musculoskeletal?.diastasisRecti || 'N/A'} / ${obj.neurological?.pudendalNerve || 'N/A'}`, currentY);
    
    // Examination
    currentY = drawRow('--- PELVIC EXAMINATION ---', '', currentY, true);
    const exam = data.examination || {};
    currentY = drawRow('Internal Consent', exam.internal?.consent, currentY);
    currentY = drawRow('External (Skin/Scar)', `${exam.external?.skinCondition || 'N/A'} / ${exam.external?.scar || 'N/A'}`, currentY);
    currentY = drawRow('Internal (Tone/Tend)', `${exam.internal?.tone || 'N/A'} / ${exam.internal?.tenderness || 'N/A'}`, currentY);
    currentY = drawRow('Strength / Prolapse', `${exam.internal?.strength || 'N/A'} / ${exam.internal?.prolapse || 'N/A'}`, currentY);
    currentY = drawRow('Endur / Reps / Quick', `${exam.internal?.endurance || 'N/A'} / ${exam.internal?.repetition || 'N/A'} / ${exam.internal?.quickContractions || 'N/A'}`, currentY);
    currentY -= 10;

    // 4. PLAN
    currentY = drawSectionHeader('4. CLINICAL DIAGNOSIS & PLAN', currentY);
    const diag = data.diagnosis || {};
    currentY = drawRow('Diagnosis', diag.clinicalDiagnosis, currentY);
    currentY = drawRow('Goal / Intervention', `${diag.goal || 'N/A'} / ${diag.intervention || 'N/A'}`, currentY);
    currentY = drawRow('Home Exercise / Freq', `${diag.homeExercise || 'N/A'} / ${diag.frequency || 'N/A'}`, currentY);
    currentY = drawRow('Follow Ups', diag.followUps, currentY);
  } 
  // --- GENERAL PHYSIOTHERAPY BRANCH ---
  else {
    activePage.drawText('GENERAL PHYSIOTHERAPY ASSESSMENT', { x: margin, y: currentY + 40, size: 12, font: timesBoldFont, color: rgb(0.2, 0.3, 0.3) });
    
    // 1. GENERAL & LIVING
    currentY = drawSectionHeader('1. ADMINISTRATIVE & DEMOGRAPHIC DETAILS', currentY);
    const gen = data.general || {};
    currentY = drawRow('Full Name', gen.patientName || patient.name, currentY);
    currentY = drawRow('Patient ID', `H2F-${patient.pid || patient.id}`, currentY);
    currentY = drawRow("Father's Name", gen.fatherName, currentY);
    currentY = drawRow('Contact', gen.phoneNumber || patient.contact, currentY);
    currentY = drawRow('Age / Gender', `${gen.age || 'N/A'} / ${gen.gender || 'N/A'}`, currentY);
    currentY = drawRow('Address', gen.address, currentY);
    currentY = drawRow('Diagnosis', gen.diagnosis, currentY);
    currentY = drawRow('Civil Status / Children', `${gen.civilStatus || 'N/A'} / ${gen.children || 'N/A'}`, currentY);
    currentY = drawRow('Occupation / Education', `${gen.occupation || 'N/A'} / ${gen.educationLevel || 'N/A'}`, currentY);
    
    currentY = drawRow('--- LIVING CONDITIONS ---', '', currentY, true);
    const liv = data.living || {};
    currentY = drawRow('House Condition', liv.houseCondition, currentY);
    currentY = drawRow('Environment / Family', `${liv.environment || 'N/A'} / ${liv.family || 'N/A'}`, currentY);
    currentY -= 15;

    // 2. HISTORY & GOALS
    currentY = drawSectionHeader('2. PATIENT HISTORY & GOALS', currentY);
    const hist = data.history || {};
    currentY = drawRow('History of Trauma', hist.historyOfTrauma, currentY);
    currentY = drawRow('Date / Circumstances', `${hist.date || 'N/A'} / ${hist.circumstances || 'N/A'}`, currentY);
    currentY = drawRow('Associated Diseases', hist.associatedDiseases, currentY);
    currentY = drawRow('Medical History / Hosp.', `${hist.medicalHistory || 'N/A'} / ${hist.hospital || 'N/A'}`, currentY);
    currentY = drawRow('Medication', hist.medication, currentY);
    currentY = drawRow('X-Ray / Exams', hist.xrayOrExams, currentY);
    
    currentY = drawRow('--- GOALS & EXPECTATIONS ---', '', currentY, true);
    const goal = data.goals || {};
    currentY = drawRow('Main Concerns', goal.mainConcerns, currentY);
    currentY = drawRow('Expectations', goal.expectations, currentY);
    currentY = drawRow('Current Treatment', goal.currentTreatment, currentY);
    currentY -= 15;

    // 3. PSYCHOLOGICAL STATUS
    currentY = drawSectionHeader('3. PSYCHOLOGICAL & SYSTEMIC STATUS', currentY);
    const psych = data.psychological || {};
    currentY = drawRow('Motivation / Attitude', `${psych.motivation || 'N/A'} / ${psych.attitude || 'N/A'}`, currentY);
    currentY = drawRow('Cognitive Status', psych.cognitiveStatus, currentY);
    currentY = drawRow('Concentration / Comm.', `${psych.concentration || 'N/A'} / ${psych.communication || 'N/A'}`, currentY);
    currentY = drawRow('Bowel/Bladder Control', psych.bowelControl, currentY);
    currentY = drawRow('Swallowing / Breathing', `${psych.swallowing || 'N/A'} / ${psych.breathing || 'N/A'}`, currentY);
    currentY -= 15;

    // 4. PHYSICAL & PAIN
    currentY = drawSectionHeader('4. PHYSICAL EXAMINATION & PAIN MAPPING', currentY);
    const phys = data.physical || {};
    currentY = drawRow('Skin Condition / Scars', `${phys.skinCondition || 'N/A'} / ${phys.scar || 'N/A'}`, currentY);
    currentY = drawRow('Swelling / Temp.', `${phys.swelling || 'N/A'} / ${phys.temperature || 'N/A'}`, currentY);
    currentY = drawRow('Sensation / Reflexes', `${phys.sensation || 'N/A'} / ${phys.reflexes || 'N/A'}`, currentY);
    currentY = drawRow('Numbness / Paresthesia', `${phys.numbness || 'N/A'} / ${phys.paresthesia || 'N/A'}`, currentY);
    
    currentY = drawRow('--- NEURODYNAMIC TESTS ---', '', currentY, true);
    currentY = drawRow('SLR / Slump', `${phys.slr || 'N/A'} / ${phys.slump || 'N/A'}`, currentY);
    currentY = drawRow('PKB / ULNT', `${phys.pkb || 'N/A'} / ${phys.ulnt || 'N/A'}`, currentY);
    
    currentY = drawRow('--- PAIN ASSESSMENT ---', '', currentY, true);
    currentY = drawRow('Pain Level (VAS)', `${phys.painScale || 0} / 10`, currentY);
    currentY = drawRow('Pain Category', phys.painCategory, currentY);
    currentY = drawRow('Pain Points', Array.isArray(phys.painPoints) ? phys.painPoints.join(', ') : (phys.painPoints || 'None'), currentY);
    currentY = drawRow('Aggravating / Easing', `${phys.painIncreaseFactors || 'N/A'} / ${phys.painDecreaseFactors || 'N/A'}`, currentY);
    currentY -= 15;

    // --- DRAW 2D ANATOMY SVG ---
    const painPoints = Array.isArray(phys.painPoints) ? phys.painPoints : [];
    
    // Check for page break before drawing large SVG
    if (currentY < 180) {
      activePage = pdfDoc.addPage([595, 842]);
      currentY = 800;
    }

    const svgScale = 3.2;
    // PDF coordinate system is bottom-left origin. For drawSvgPath, it usually aligns differently, but we'll try to center it.
    // drawSvgPath starts at x,y. But we must invert Y if we want it right side up or rely on scale.
    // The SVGs are 0..24 width and 0..40 height.
    const mapY = currentY - 140; 
    
    activePage.drawText('FRONT VIEW', { x: margin + 30, y: currentY - 10, size: 8, font: timesBoldFont, color: rgb(0.4, 0.4, 0.4) });
    // drawSvgPath respects coordinates where smaller Y is lower. BUT SVG paths generally have Y going down.
    // pdf-lib's drawSvgPath correctly parses it but might be upside down if not careful. 
    // Wait, drawSvgPath handles it, but Y=0 is bottom in PDF, so drawing it at mapY will draw it upwards or downwards depending on implementation.
    // It usually draws with Y going down starting from the y point you provide.
    
    activePage.drawSvgPath(BODY_SILHOUETTE_PATH, { x: margin + 40, y: currentY - 20, scale: svgScale, color: rgb(0.94, 0.96, 0.98), borderColor: rgb(0.8, 0.83, 0.88), borderWidth: 0.5 });
    FRONT_PARTS.forEach(part => {
      const isSelected = painPoints.includes(part.id);
      activePage.drawSvgPath(part.path, {
        x: margin + 40, y: currentY - 20, scale: svgScale,
        color: isSelected ? rgb(1, 0.42, 0) : rgb(0.88, 0.91, 0.94),
        borderColor: isSelected ? rgb(0.8, 0.2, 0) : rgb(0.8, 0.83, 0.88),
        borderWidth: 0.5
      });
    });

    activePage.drawText('BACK VIEW', { x: margin + 180, y: currentY - 10, size: 8, font: timesBoldFont, color: rgb(0.4, 0.4, 0.4) });
    activePage.drawSvgPath(BODY_SILHOUETTE_PATH, { x: margin + 190, y: currentY - 20, scale: svgScale, color: rgb(0.94, 0.96, 0.98), borderColor: rgb(0.8, 0.83, 0.88), borderWidth: 0.5 });
    BACK_PARTS.forEach(part => {
      const isSelected = painPoints.includes(part.id);
      activePage.drawSvgPath(part.path, {
        x: margin + 190, y: currentY - 20, scale: svgScale,
        color: isSelected ? rgb(1, 0.42, 0) : rgb(0.88, 0.91, 0.94),
        borderColor: isSelected ? rgb(0.8, 0.2, 0) : rgb(0.8, 0.83, 0.88),
        borderWidth: 0.5
      });
    });

    currentY -= 160;

    // 5. ROM & MUSCLE
    currentY = drawSectionHeader('5. ROM & MUSCLE TESTING', currentY);
    const rom = data.rom || {};
    currentY = drawRow('Shoulder / Elbow ROM', `${rom.shoulder || 'N/A'} / ${rom.elbow || 'N/A'}`, currentY);
    currentY = drawRow('Wrist / Fingers ROM', `${rom.wrist || 'N/A'} / ${rom.fingers || 'N/A'}`, currentY);
    currentY = drawRow('Hip / Knee ROM', `${rom.hip || 'N/A'} / ${rom.knee || 'N/A'}`, currentY);
    currentY = drawRow('Neck / Trunk ROM', `${rom.neckMovements || 'N/A'} / ${rom.trunkMovements || 'N/A'}`, currentY);
    
    currentY = drawRow('--- MUSCLE TEST & TONE ---', '', currentY, true);
    const mus = data.muscleTest || {};
    const tone = data.muscleTone || {};
    currentY = drawRow('Oxford Scale (Power)', mus.oxfordScale, currentY);
    currentY = drawRow('Mod. Ashworth (Tone)', tone.modifiedAshworth, currentY);
    currentY = drawRow('Upper / Lower Limb MT', `${mus.upperLimb || 'N/A'} / ${mus.lowerLimb || 'N/A'}`, currentY);
    currentY -= 15;

    // 6. FUNCTIONAL EVAL
    currentY = drawSectionHeader('6. FUNCTIONAL MOBILITY & GAIT', currentY);
    const funcEv = data.functional || {};
    currentY = drawRow('Balance / Coordination', `${funcEv.balance || 'N/A'} / ${funcEv.coordination || 'N/A'}`, currentY);
    currentY = drawRow('Gait Quality / Safety', `${funcEv.gaitQuality || 'N/A'} / ${funcEv.safety || 'N/A'}`, currentY);
    currentY = drawRow('Cadence / Speed', `${funcEv.cadence || 'N/A'} / ${funcEv.speed || 'N/A'}`, currentY);
    
    currentY = drawRow('--- ACTIVITIES & ASSISTANCE ---', '', currentY, true);
    const act = data.activity || {};
    currentY = drawRow('Assistive Devices', Array.isArray(act.assistiveDevices) ? act.assistiveDevices.join(', ') : (act.assistiveDevices || 'None'), currentY);
    currentY = drawRow('Transfers / Mobility', `${act.transfers || 'N/A'} / ${act.mobility || 'N/A'}`, currentY);
    currentY = drawRow('Daily Activities (ADL)', act.dailyActivities, currentY);
    currentY -= 15;

    // 7. CONCLUSION & PLAN
    currentY = drawSectionHeader('7. CONCLUSION & TREATMENT PLAN', currentY);
    const conc = data.conclusion || {};
    currentY = drawRow('Environmental / Personal', `${conc.environmentalFactors || 'N/A'} / ${conc.personalConditions || 'N/A'}`, currentY);
    currentY = drawRow('Clinical Remarks', conc.remarks, currentY);
    currentY = drawRow('Activity Limitations', conc.activityLimitations, currentY);
    
    currentY = drawRow('--- PROPOSED PLAN ---', '', currentY, true);
    const planObj = data.plan || {};
    currentY = drawRow('Short-Term Goals', planObj.shortTermGoals, currentY);
    currentY = drawRow('Long-Term Goals', planObj.longTermGoals, currentY);
    currentY = drawRow('Treatment Proposals', planObj.treatmentProposals, currentY);
    currentY = drawRow('Follow-Up Plan', planObj.followUpPlan, currentY);
  }

  // Footer / Signature (on the last page)
  const footerY = 80;
  if (currentY < 120) {
    activePage = pdfDoc.addPage([595, 842]);
    currentY = 800;
  }
  activePage.drawLine({ start: { x: margin, y: footerY + 40 }, end: { x: width - margin, y: footerY + 40 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  activePage.drawText('Physiotherapist Signature', { x: margin, y: footerY, size: 9, font: timesBoldFont });
  activePage.drawText('Date of Report', { x: margin + 200, y: footerY, size: 9, font: timesBoldFont });
  activePage.drawText('Clinical Lead Approval', { x: width - margin - 120, y: footerY, size: 9, font: timesBoldFont });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};

export const generateFinancialReport = async (invoices: any[], branches: any[]) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const margin = 50;
  let currentY = height - 160;

  // Header
  page.drawRectangle({ x: 0, y: height - 80, width: width, height: 80, color: rgb(0.1, 0.2, 0.2) });
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  // Logo Embedding
  try {
    const logoResponse = await fetch('/h2f_log_cropped.jpeg');
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedJpg(logoBytes);
    page.drawImage(logoImage, {
      x: margin,
      y: height - 60,
      width: 100,
      height: 40,
    });
  } catch (e) {
    console.warn("Logo not found, proceeding without logo branding.");
  }

  page.drawText('FINANCIAL PERFORMANCE AUDIT', { x: margin + 110, y: height - 42, size: 14, font: timesBoldFont, color: rgb(1,1,1) });
  page.drawText(`Generated: ${dateStr} | ${timeStr}`, { 
    x: width - margin - 140, 
    y: height - 42, 
    size: 7, 
    font: timesBoldFont, 
    color: rgb(0.8, 0.8, 0.8) 
  });
  page.drawText('Executive Revenue & Tax Summary Report', { x: margin + 50, y: height - 56, size: 8, font: timesRomanFont, color: rgb(0.6, 0.6, 0.6) });

  const drawSection = (title: string, y: number) => {
    page.drawRectangle({ x: margin, y: y - 5, width: width - (margin * 2), height: 22, color: rgb(0.35, 0.7, 0.7) });
    page.drawText(title, { x: margin + 10, y: y, size: 10, font: timesBoldFont, color: rgb(1,1,1) });
    return y - 30;
  };

  const drawRow = (label: string, value: string, y: number, isTotal = false) => {
    const colWidth = 250;
    page.drawRectangle({ x: margin, y: y - 5, width: width - (margin * 2), height: 25, color: isTotal ? rgb(0.95, 0.98, 0.98) : rgb(1,1,1) });
    page.drawText(label.toUpperCase(), { x: margin + 10, y: y + 5, size: 8, font: timesBoldFont, color: rgb(0.3, 0.4, 0.4) });
    page.drawText(value || 'N/A', { x: margin + colWidth, y: y + 5, size: 10, font: isTotal ? timesBoldFont : timesRomanFont, color: rgb(0.1, 0.1, 0.1) });
    page.drawLine({ start: { x: margin, y: y - 5 }, end: { x: width - margin, y: y - 5 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
    return y - 25;
  };

  // Calculations
  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0);
  const taxCollected = totalCollected * 0.18; // 18% GST Assumption

  // 1. EXECUTIVE SUMMARY
  currentY = drawSection('1. EXECUTIVE FINANCIAL SUMMARY', currentY);
  currentY = drawRow('Total Billed Amount', `INR ${totalBilled.toLocaleString('en-IN')}`, currentY);
  currentY = drawRow('Total Collected Revenue', `INR ${totalCollected.toLocaleString('en-IN')}`, currentY);
  currentY = drawRow('Total Outstanding (Due)', `INR ${totalOutstanding.toLocaleString('en-IN')}`, currentY, true);
  currentY = drawRow('Tax Liability (18% GST Est.)', `INR ${taxCollected.toLocaleString('en-IN')}`, currentY);
  currentY -= 30;

  // 2. BRANCH PERFORMANCE
  currentY = drawSection('2. BRANCH-WISE PERFORMANCE AUDIT', currentY);
  branches.forEach(branch => {
    const branchInvoices = invoices.filter(inv => inv.branch === branch.name);
    const branchRev = branchInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const branchDue = branchInvoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0);
    
    currentY = drawRow(branch.name, `Rev: INR ${branchRev.toLocaleString('en-IN')} | Due: INR ${branchDue.toLocaleString('en-IN')}`, currentY);
  });

  if (branches.length === 0) {
    currentY = drawRow('Data Availability', 'No Branch Data Available (N/A)', currentY);
  }

  currentY -= 30;

  // 3. INSURANCE & CLAIMS
  currentY = drawSection('3. INSURANCE CLAIM SUMMARIES', currentY);
  currentY = drawRow('Active Insurance Claims', 'N/A (Module Pending)', currentY);
  currentY = drawRow('Processed Reimbursements', 'INR 0.00', currentY);

  // Footer
  const footerY = 60;
  page.drawLine({ start: { x: margin, y: footerY + 40 }, end: { x: width - margin, y: footerY + 40 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  page.drawText('Clinic Director Signature', { x: margin, y: footerY, size: 9, font: timesBoldFont });
  page.drawText('Audit Seal', { x: width - margin - 80, y: footerY, size: 9, font: timesBoldFont });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};

export const generateInvoicePDF = async (invoice: any) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const margin = 50;
  let currentY = height - 160;

  // Header
  page.drawRectangle({ x: 0, y: height - 80, width: width, height: 80, color: rgb(0.1, 0.2, 0.2) });
  
  const dateObj = new Date(invoice.date || new Date());
  const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  // Logo Embedding
  try {
    const logoResponse = await fetch('/h2f_log_cropped.jpeg');
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedJpg(logoBytes);
    page.drawImage(logoImage, {
      x: margin,
      y: height - 60,
      width: 100,
      height: 40,
    });
  } catch (e) {
    console.warn("Logo not found, proceeding without logo branding.");
  }

  page.drawText('CLINIC INVOICE', { x: margin + 110, y: height - 42, size: 14, font: timesBoldFont, color: rgb(1,1,1) });
  page.drawText(`INVOICE: ${invoice.id?.substring(0, 8).toUpperCase()}`, { 
    x: width - margin - 140, 
    y: height - 42, 
    size: 9, 
    font: timesBoldFont, 
    color: rgb(0.8, 0.8, 0.8) 
  });
  page.drawText('Billing & Payment Receipt', { x: margin + 50, y: height - 56, size: 8, font: timesRomanFont, color: rgb(0.6, 0.6, 0.6) });

  const drawSection = (title: string, y: number) => {
    page.drawRectangle({ x: margin, y: y - 5, width: width - (margin * 2), height: 22, color: rgb(0.35, 0.7, 0.7) });
    page.drawText(title, { x: margin + 10, y: y, size: 10, font: timesBoldFont, color: rgb(1,1,1) });
    return y - 30;
  };

  const drawRow = (label: string, value: string, y: number, isTotal = false) => {
    const colWidth = 250;
    page.drawRectangle({ x: margin, y: y - 5, width: width - (margin * 2), height: 25, color: isTotal ? rgb(0.95, 0.98, 0.98) : rgb(1,1,1) });
    page.drawText(label.toUpperCase(), { x: margin + 10, y: y + 5, size: 8, font: timesBoldFont, color: rgb(0.3, 0.4, 0.4) });
    page.drawText(value || 'N/A', { x: margin + colWidth, y: y + 5, size: 10, font: isTotal ? timesBoldFont : timesRomanFont, color: rgb(0.1, 0.1, 0.1) });
    page.drawLine({ start: { x: margin, y: y - 5 }, end: { x: width - margin, y: y - 5 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
    return y - 25;
  };

  // 1. BILL TO
  currentY = drawSection('1. PATIENT DETAILS', currentY);
  currentY = drawRow('Patient Name', invoice.patientName || 'Unknown', currentY);
  currentY = drawRow('Patient ID', invoice.patientId ? `H2F-${invoice.patientId}` : 'N/A', currentY);
  currentY = drawRow('Date of Issue', dateStr, currentY);
  currentY -= 15;

  // 2. PAYMENT DETAILS
  currentY = drawSection('2. PAYMENT SUMMARY', currentY);
  currentY = drawRow('Total Amount', `INR ${invoice.totalAmount?.toLocaleString('en-IN') || 0}`, currentY);
  currentY = drawRow('Paid Amount', `INR ${invoice.paidAmount?.toLocaleString('en-IN') || 0}`, currentY);
  currentY = drawRow('Due Amount', `INR ${invoice.dueAmount?.toLocaleString('en-IN') || 0}`, currentY, true);
  currentY = drawRow('Payment Status', invoice.status || 'PENDING', currentY);
  currentY -= 30;

  // Footer
  const footerY = 60;
  page.drawLine({ start: { x: margin, y: footerY + 40 }, end: { x: width - margin, y: footerY + 40 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  page.drawText('Authorized Signatory', { x: margin, y: footerY, size: 9, font: timesBoldFont });
  page.drawText('Thank you for choosing H2F Rehab', { x: width / 2 - 80, y: footerY, size: 9, font: timesRomanFont, color: rgb(0.5, 0.5, 0.5) });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};

export const generatePayrollPDF = async (staff: any, monthStr: string) => {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const margin = 50;
  let currentY = height - 160;

  // Header
  page.drawRectangle({ x: 0, y: height - 80, width: width, height: 80, color: rgb(0.1, 0.2, 0.2) });
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  // Logo Embedding
  try {
    const logoResponse = await fetch('/h2f_log_cropped.jpeg');
    const logoBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedJpg(logoBytes);
    page.drawImage(logoImage, {
      x: margin,
      y: height - 60,
      width: 100,
      height: 40,
    });
  } catch (e) {
    console.warn("Logo not found, proceeding without logo branding.");
  }

  page.drawText('PAYROLL PAYSLIP', { x: margin + 110, y: height - 42, size: 14, font: timesBoldFont, color: rgb(1,1,1) });
  page.drawText(`PAYSLIP: ${staff.id?.substring(0, 8).toUpperCase()}`, { 
    x: width - margin - 140, 
    y: height - 42, 
    size: 9, 
    font: timesBoldFont, 
    color: rgb(0.8, 0.8, 0.8) 
  });
  page.drawText('Confidential Salary Information', { x: margin + 50, y: height - 56, size: 8, font: timesRomanFont, color: rgb(0.6, 0.6, 0.6) });

  const drawSection = (title: string, y: number) => {
    page.drawRectangle({ x: margin, y: y - 5, width: width - (margin * 2), height: 22, color: rgb(0.35, 0.7, 0.7) });
    page.drawText(title, { x: margin + 10, y: y, size: 10, font: timesBoldFont, color: rgb(1,1,1) });
    return y - 30;
  };

  const drawRow = (label: string, value: string, y: number, isTotal = false) => {
    const colWidth = 250;
    page.drawRectangle({ x: margin, y: y - 5, width: width - (margin * 2), height: 25, color: isTotal ? rgb(0.95, 0.98, 0.98) : rgb(1,1,1) });
    page.drawText(label.toUpperCase(), { x: margin + 10, y: y + 5, size: 8, font: timesBoldFont, color: rgb(0.3, 0.4, 0.4) });
    page.drawText(value || '0', { x: margin + colWidth, y: y + 5, size: 10, font: isTotal ? timesBoldFont : timesRomanFont, color: rgb(0.1, 0.1, 0.1) });
    page.drawLine({ start: { x: margin, y: y - 5 }, end: { x: width - margin, y: y - 5 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
    return y - 25;
  };

  // 1. STAFF DETAILS
  currentY = drawSection('1. STAFF DETAILS', currentY);
  currentY = drawRow('Staff Name', staff.name || 'Unknown', currentY);
  currentY = drawRow('Role / Branch', `${staff.role || 'N/A'} / ${staff.branch || 'N/A'}`, currentY);
  currentY = drawRow('Payroll Month', monthStr, currentY);
  currentY = drawRow('Date Generated', dateStr, currentY);
  currentY -= 15;

  // 2. EARNINGS & DEDUCTIONS
  currentY = drawSection('2. EARNINGS & DEDUCTIONS', currentY);
  currentY = drawRow('Days Present', String(staff.daysPresent || 0), currentY);
  currentY = drawRow('Base Salary', `INR ${staff.salary?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || 0}`, currentY);
  currentY = drawRow('Bonus / Allowance', `INR ${staff.bonus?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || 0}`, currentY);
  currentY = drawRow('Deductions', `INR ${staff.deductions?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || 0}`, currentY);
  currentY = drawRow('Net Pay', `INR ${staff.netPay?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || 0}`, currentY, true);
  currentY -= 30;

  // Footer
  const footerY = 60;
  page.drawLine({ start: { x: margin, y: footerY + 40 }, end: { x: width - margin, y: footerY + 40 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  page.drawText('Authorized HR Signatory', { x: margin, y: footerY, size: 9, font: timesBoldFont });
  page.drawText('Confidential Document', { x: width / 2 - 40, y: footerY, size: 9, font: timesRomanFont, color: rgb(0.5, 0.5, 0.5) });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
