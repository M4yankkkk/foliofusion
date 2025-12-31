import fs from 'fs';
import path from 'path';

/**
 * Escapes LaTeX special characters in text
 */
function escapeLatex(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/\n/g, ' ');
}

/**
 * Formats a month-year string to "Month YYYY" format
 */
function formatMonthYear(monthYear) {
  if (!monthYear) return '';
  try {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return monthYear;
  }
}

/**
 * Generates LaTeX content for education section
 */
function generateEducation(profile) {
  // Since education isn't in current schema, we'll add a placeholder
  // or generate from experience if available
  return `    \\resumeSubheading
      {${escapeLatex(profile.university || 'University Name')}}{${escapeLatex(profile.location || '')}}
      {${escapeLatex(profile.degree || 'Degree')}}{${escapeLatex(profile.graduation_date || '')}}`;
}

/**
 * Generates LaTeX content for experience section
 */
function generateExperience(experiences) {
  if (!experiences || experiences.length === 0) {
    return '';
  }

  return experiences.map(exp => {
    // Handle both snake_case and camelCase field names
    const startDate = formatMonthYear(exp.startMonthYear || exp.start_month_year);
    const endDate = (exp.endMonthYear || exp.end_month_year) 
      ? formatMonthYear(exp.endMonthYear || exp.end_month_year) 
      : 'Present';
    const dateRange = `${startDate} -- ${endDate}`;

    // Split description into bullet points (by newline or period)
    const bullets = exp.description
      ? exp.description.split(/\n|\./).filter(b => b.trim()).map(b => `      \\resumeItem{${escapeLatex(b.trim())}}`)
      : [];

    return `    \\resumeSubheading
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location || '')}}
      {${escapeLatex(exp.role)}}{${dateRange}}
      \\resumeItemListStart
${bullets.join('\n')}
      \\resumeItemListEnd`;
  }).join('\n\n');
}

/**
 * Generates LaTeX content for projects section
 */
function generateProjects(projects) {
  if (!projects || projects.length === 0) {
    return '';
  }

  return projects.map(project => {
    // Handle both snake_case and camelCase
    const techStack = project.tech_stack || project.techStack || '';
    const heading = `\\textbf{${escapeLatex(project.name)}}${techStack ? ` $|$ \\emph{${escapeLatex(techStack)}}` : ''}`;
    
    // Split description into bullet points
    const bullets = project.description
      ? project.description.split(/\n|\./).filter(b => b.trim()).map(b => `      \\resumeItem{${escapeLatex(b.trim())}}`)
      : [];

    return `    \\resumeProjectHeading
          {${heading}}{${project.link ? `\\href{${project.link}}{Link}` : ''}}
      \\resumeItemListStart
${bullets.join('\n')}
      \\resumeItemListEnd`;
  }).join('\n\n');
}

/**
 * Generates LaTeX content for skills section
 */
function generateSkills(skills) {
  if (!skills || skills.length === 0) {
    return '';
  }

  // Join skills with comma separation
  return skills.map(s => escapeLatex(s)).join(', ');
}

/**
 * Generates social links for header
 */
function generateSocialLinks(profile) {
  const links = [];
  
  if (profile.linkedin) {
    links.push(`\\href{${profile.linkedin}}{\\underline{LinkedIn}}`);
  }
  if (profile.github) {
    links.push(`\\href{${profile.github}}{\\underline{GitHub}}`);
  }
  if (profile.twitter) {
    links.push(`\\href{${profile.twitter}}{\\underline{Twitter}}`);
  }

  return links.length > 0 ? ' $|$ ' + links.join(' $|$ ') : '';
}

/**
 * Generates complete LaTeX document from profile data
 */
export function generateLatexResume(profile) {
  try {
    // Read the template
    const templatePath = path.join(process.cwd(), 'templates', 'resume-template.tex');
    console.log('Reading template from:', templatePath);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found at: ${templatePath}`);
    }
    
    let template = fs.readFileSync(templatePath, 'utf-8');
    console.log('Template loaded, length:', template.length);

    // Replace placeholders
    template = template.replace('{{NAME}}', escapeLatex(profile.name || ''));
    template = template.replace('{{PHONE}}', escapeLatex(profile.phone || ''));
    template = template.replace('{{EMAIL}}', escapeLatex(profile.email || ''));
    template = template.replace('{{SOCIAL_LINKS}}', generateSocialLinks(profile));
    
    template = template.replace('{{EDUCATION}}', generateEducation(profile));
    template = template.replace('{{EXPERIENCE}}', generateExperience(profile.experience || []));
    template = template.replace('{{PROJECTS}}', generateProjects(profile.projects || []));
    template = template.replace('{{SKILLS}}', generateSkills(profile.skills || []));

    return template;
  } catch (error) {
    console.error('LaTeX generation error:', error);
    throw error;
  }
}

/**
 * Compiles LaTeX to PDF using latex.online API
 */
export async function compileLatexToPdf(latexContent) {
  try {
    console.log('Sending to latex.online, content length:', latexContent.length);
    
    // latexonline.cc API: GET request with text parameter
    const url = `https://latexonline.cc/compile?text=${encodeURIComponent(latexContent)}`;
    console.log('Request URL length:', url.length);
    
    const response = await fetch(url, {
      method: 'GET',
    });

    console.log('LaTeX API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('LaTeX API error response:', errorText);
      throw new Error(`LaTeX compilation failed: ${response.statusText} - ${errorText}`);
    }

    const pdfBuffer = await response.arrayBuffer();
    console.log('PDF generated, size:', pdfBuffer.byteLength);
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('LaTeX compilation error:', error);
    throw error;
  }
}
