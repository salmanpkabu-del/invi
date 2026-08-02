import re

with open('js/components/invite.js', 'r') as f:
    content = f.read()

# Add dynamic style tag for custom colors and fonts
dynamic_style = """
  // Check URL search param for guest personalized greeting
  const urlParams = new URLSearchParams(window.location.search);
  const personalizedGuest = urlParams.get('guest');

  const currentUrl = window.location.href;
  
  let customStyles = '';
  let googleFontLink = '';
  
  if (activeEvent.customColor) {
    customStyles += `--theme-accent: ${activeEvent.customColor} !important;\n`;
    customStyles += `--theme-primary: ${activeEvent.customColor} !important;\n`;
    customStyles += `--color-primary: ${activeEvent.customColor} !important;\n`;
  }
  
  if (activeEvent.customFont) {
    const fontName = activeEvent.customFont.split(',')[0].replace(/['"]/g, '').trim();
    googleFontLink = `<link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">`;
    customStyles += `--theme-font-title: ${activeEvent.customFont} !important;\n`;
    customStyles += `--theme-font-script: ${activeEvent.customFont} !important;\n`;
    customStyles += `--font-display: ${activeEvent.customFont} !important;\n`;
  }
  
  const customStyleTag = customStyles ? `<style>.invitation-wrapper { ${customStyles} }</style>` : '';
"""
content = content.replace("  const currentUrl = window.location.href;", dynamic_style)

# Add customStyleTag and googleFontLink to container.innerHTML
content = content.replace("    <!-- Premium Cinematic Envelope Opener — populated by JS engine -->", "    ${googleFontLink}\n    ${customStyleTag}\n\n    <!-- Premium Cinematic Envelope Opener — populated by JS engine -->")

# Replace section conditions
# Story Section
old_story = "${(activeEvent.storyMilestones && activeEvent.storyMilestones.length > 0) ? `"
new_story = "${(activeEvent.visibleSections?.story !== false && activeEvent.storyMilestones && activeEvent.storyMilestones.length > 0) ? `"
content = content.replace(old_story, new_story)

# Schedule Section
# We need to wrap section-schedule in a condition
old_schedule_start = "      <!-- Schedule & Venues Section -->\n      <section id=\"section-schedule\" class=\"inv-section\">"
new_schedule_start = "      <!-- Schedule & Venues Section -->\n      ${(activeEvent.visibleSections?.schedule !== false) ? `\n      <section id=\"section-schedule\" class=\"inv-section\">"
content = content.replace(old_schedule_start, new_schedule_start)

# Finding the end of section-schedule and adding ` : ''}
old_schedule_end = "        </div>\n      </section>\n\n      <!-- Dress Code Section -->"
new_schedule_end = "        </div>\n      </section>\n      ` : ''}\n\n      <!-- Dress Code Section -->"
content = content.replace(old_schedule_end, new_schedule_end)

# Dress Code Section
old_dress = "${activeEvent.dressCode ? `"
new_dress = "${(activeEvent.visibleSections?.dressCode !== false && activeEvent.dressCode) ? `"
content = content.replace(old_dress, new_dress)

# Wishes Section
old_wishes_start = "      <!-- Wishes & Guestbook Section -->\n      <section id=\"section-wishes\" class=\"inv-section\">"
new_wishes_start = "      <!-- Wishes & Guestbook Section -->\n      ${(activeEvent.visibleSections?.wishes !== false) ? `\n      <section id=\"section-wishes\" class=\"inv-section\">"
content = content.replace(old_wishes_start, new_wishes_start)

old_wishes_end = "        </div>\n      </section>\n    </div>"
new_wishes_end = "        </div>\n      </section>\n      ` : ''}\n    </div>"
content = content.replace(old_wishes_end, new_wishes_end)

# Also update the navigation dots conditionally
old_nav = """      <!-- Floating Dots Section Navigation -->
      <div id="floating-section-nav">
        <div class="nav-dot active" data-section="section-hero" title="Hero"></div>
        <div class="nav-dot" data-section="section-story" title="Our Story"></div>
        <div class="nav-dot" data-section="section-schedule" title="Itinerary & Venues"></div>
        <div class="nav-dot" data-section="section-dresscode" title="Dress Code"></div>
        <div class="nav-dot" data-section="section-faq" title="FAQ & Registry"></div>
        <div class="nav-dot" data-section="section-wishes" title="Guest Wishes"></div>
      </div>"""
      
new_nav = """      <!-- Floating Dots Section Navigation -->
      <div id="floating-section-nav">
        <div class="nav-dot active" data-section="section-hero" title="Hero"></div>
        ${(activeEvent.visibleSections?.story !== false && activeEvent.storyMilestones?.length > 0) ? '<div class="nav-dot" data-section="section-story" title="Our Story"></div>' : ''}
        ${(activeEvent.visibleSections?.schedule !== false) ? '<div class="nav-dot" data-section="section-schedule" title="Itinerary & Venues"></div>' : ''}
        ${(activeEvent.visibleSections?.dressCode !== false && activeEvent.dressCode) ? '<div class="nav-dot" data-section="section-dresscode" title="Dress Code"></div>' : ''}
        <div class="nav-dot" data-section="section-faq" title="FAQ & Registry"></div>
        ${(activeEvent.visibleSections?.wishes !== false) ? '<div class="nav-dot" data-section="section-wishes" title="Guest Wishes"></div>' : ''}
      </div>"""
content = content.replace(old_nav, new_nav)


with open('js/components/invite.js', 'w') as f:
    f.write(content)

print("Invite.js updated successfully")
