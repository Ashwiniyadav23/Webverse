export const phaseOneSections = [
  {
    title: "HTML Basics",
    topics: ["<!DOCTYPE html>", "<html>", "<head>", "<title>", "<body>", "<header>", "<main>", "<footer>", "<h1>"],
    learn: "An HTML document has an outer structure. The doctype tells the browser to use modern HTML. html wraps the page; head stores page information such as the browser-tab title; body contains visible content. header introduces a page, main contains its central content, footer closes it, and h1 names its main topic.",
    syntax: '<!DOCTYPE html>\n<html lang="en">\n<head><title>My Portal</title></head>\n<body>\n  <header><h1>Welcome</h1></header>\n  <main><p>Start here.</p></main>\n  <footer>Student Portal</footer>\n</body>\n</html>',
    tasks: ["Create a valid HTML document.", "Add a page title, main heading, and welcome paragraph; divide the page into header, main, and footer.", "Identify and correct errors in an incomplete HTML document."],
  },
  {
    title: "Navigation & Lists",
    topics: ["<nav>", "<a> and href", "<ul>, <ol>, and <li>", "Relative file paths", "Linking HTML pages"],
    learn: "nav groups important navigation links. An a element makes a link and href names its destination. ul is for collections without a required order; ol is for sequences; each list entry belongs in li. A relative path starts from the current HTML file: ../ moves to its parent folder.",
    syntax: '<nav><ul>\n  <li><a href="index.html">Home</a></li>\n  <li><a href="pages/profile.html">Profile</a></li>\n</ul></nav>\n<ol><li>First step</li><li>Next step</li></ol>',
    tasks: ["Create a navigation list and link two HTML pages.", "Create an ordered list and an unordered list.", "Fix broken links and incorrect relative paths; build navigation for a six-page website."],
  },
  {
    title: "Headings & Images",
    topics: ["<h1>, <h2>, and <h3>", "<p>", "<img>", "src and alt attributes", "Relevant text formatting"],
    learn: "Headings describe the page outline: h1 is the main topic, with h2 and h3 for nested sections. Use p for prose. img displays an image from src. Its alt text communicates the useful meaning of an image when it cannot be seen or loaded. Use text emphasis only when its meaning fits.",
    syntax: '<h1>About Me</h1>\n<h2>Personal details</h2>\n<p>I enjoy learning and helping my community.</p>\n<img src="images/profile.jpg" alt="A student smiling outdoors">',
    tasks: ["Create a student introduction with personal details and headings.", "Add a profile picture with appropriate alternative text.", "Correct a missing image path and an inappropriate heading structure."],
  },
  {
    title: "Semantic HTML",
    topics: ["<header>", "<nav>", "<main>", "<footer>", "Headings and meaningful sections"],
    learn: "Semantic elements name the job of a page region. header introduces the page, nav groups important links, main marks the central content, and footer contains closing or ownership information. Use headings to name content sections and choose elements for their meaning rather than appearance.",
    syntax: '<header><h1>Student Portal</h1></header>\n<nav>Page links</nav>\n<main><section><h2>Announcements</h2><p>Welcome.</p></section></main>\n<footer>Portal information</footer>',
    tasks: ["Structure a page using semantic HTML and meaningful sections.", "Identify inappropriate or unnecessary structural tags.", "Create a consistent structure for multiple pages."],
  },
  {
    title: "Forms",
    topics: ["<form>", "<label>", "<input> text, email, radio, checkbox", "<textarea>", "<select> and <option>", "<button type=submit>", "name and required"],
    learn: "A form groups controls for information. A label tells people what a control asks; connect it using matching label for and input id. input types describe expected values. textarea accepts longer text, and select contains option choices. name identifies a submitted value; required asks the browser to require it. This practice form will not store or deliver submissions without a configured service.",
    syntax: '<form action="#" method="post">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required>\n  <button type="submit">Send feedback</button>\n</form>',
    tasks: ["Create a form with a student's name and email.", "Add radio buttons, checkboxes, a feedback textarea, and a dropdown.", "Associate labels with controls and build a structured feedback form."],
  },
  {
    title: "Tables",
    topics: ["<table>", "<caption>", "<thead>", "<tbody>", "<tfoot>", "<tr>", "<th>", "<td>"],
    learn: "Use a table for data that belongs in rows and columns. caption describes the table. thead groups column headings, tbody groups data rows, and tfoot groups summary information. tr creates a row; th labels a row or column; td holds a data value.",
    syntax: '<table>\n  <caption>Term grades</caption>\n  <thead><tr><th>Course</th><th>Grade</th><th>Credits</th></tr></thead>\n  <tbody><tr><td>HTML</td><td>A</td><td>3</td></tr></tbody>\n  <tfoot><tr><th>Total credits</th><td colspan="2">3</td></tr></tfoot>\n</table>',
    tasks: ["Create a grades table with course names, grades, and credits.", "Add a caption and separate table head, body, and footer.", "Identify and fix missing or incorrectly structured rows and cells."],
  },
] as const;

export const portalPages = [
  { name: "Home", time: "90 minutes", requirements: "Document structure; header and h1 website title; nav with ul, li, and links; main welcome message; footer copyright or closing message." },
  { name: "Profile", time: "75 minutes", requirements: "My Profile heading; profile picture; headings for personal details, hobbies, and goals; biography paragraphs; a list of hobbies, skills, or goals; navigation." },
  { name: "Courses", time: "75 minutes", requirements: "My Courses heading; course names as headings; course descriptions; course or module lists; navigation; optional course detail links." },
  { name: "Feedback", time: "90 minutes", requirements: "Submit Feedback heading; labeled form; text and email inputs; radio buttons and checkboxes; textarea; select and option; submit button; navigation." },
  { name: "Grades Table", time: "60 minutes", requirements: "My Grades heading; caption, thead, tbody, tfoot, tr, th, and td; course name, grade, and credits columns; navigation." },
  { name: "Contact Us", time: "No additional time specified", requirements: "Dummy contact details; mailto email links; address or contact paragraph; headings for contact methods; navigation." },
] as const;
