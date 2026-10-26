export type HtmlQuestion = {
  question: string;
  answer: string;
};

export type HtmlQuizQuestion = {
  kind: "multiple-choice" | "predict-output" | "find-and-fix" | "code-challenge";
  difficulty: "Beginner" | "Intermediate" | "Challenge" | "Easy" | "Medium" | "Challenging";
  prompt: string;
  snippet?: string;
  options: string[];
  answerIndex: number;
  hint: string;
  explanation: string;
};

export type HtmlTopicContent = {
  title: string;
  explanation: string;
  syntax: string;
  example: string;
  expectedOutput: string;
  useCases: string[];
  commonMistakes: string[];
  practice: string[];
  syntaxNotes?: string[];
  quiz: HtmlQuizQuestion[];
};

export const htmlMilestoneOneTopics: HtmlTopicContent[] = [
  {
    title: "1. Document Structure",
    explanation: "An HTML document has a standard outer structure that tells the browser what kind of document it is and where its information belongs. The doctype selects modern HTML. The html element wraps the whole page. The head holds information about the page, such as its character encoding and browser-tab title; the body holds the content people see. The lang attribute on html identifies the page language for browsers and assistive technology.",
    syntax: "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\">\n    <title>Page title</title>\n  </head>\n  <body>\n    Visible page content\n  </body>\n</html>",
    example: "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Welcome to my page</h1>\n  <p>I am learning how web pages are structured.</p>\n</body>\n</html>",
    expectedOutput: "The browser tab says “My First Page”. In the page, you see a large “Welcome to my page” heading followed by one paragraph.",
    useCases: ["Every standalone HTML page needs a document structure.", "The title appears in the browser tab, bookmarks, and search results.", "The language and character encoding help browsers and assistive tools interpret content correctly."],
    commonMistakes: ["Putting visible page text inside head instead of body.", "Forgetting the doctype or the closing html tag.", "Using a title element but expecting its text to appear in the page body."],
    practice: ["Create a page titled “My Hometown” with one visible heading and one sentence.", "Change lang to the correct language code for a page written in another language."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "Which element contains the content shown in the page itself?", options: ["<body>", "<head>", "<title>", "<!doctype>"], answerIndex: 0, hint: "Think about the part of the document meant for visible content.", explanation: "The body contains the page content that appears in the browser window." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "What will a visitor see in the page body?", snippet: "<head><title>Garden Notes</title></head><body><p>Seeds need water.</p></body>", options: ["Only the words “Seeds need water.”", "Only “Garden Notes”", "Both lines appear in the body", "Nothing appears"], answerIndex: 0, hint: "The title is document metadata, not body content.", explanation: "The paragraph appears in the page. Garden Notes is shown as the browser tab title." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "Which fix puts the heading in the correct document section?", snippet: "<html><head><h1>News</h1><title>Daily News</title></head><body></body></html>", options: ["Move h1 into body; keep title in head", "Move title into body and leave h1 in head", "Put both elements before html", "Remove body"], answerIndex: 0, hint: "Headings are visible content; title is page metadata.", explanation: "The h1 belongs inside body because readers see it. The title belongs in head and labels the browser tab." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose the best missing structure for an English page titled “Recipe”.", options: ["<html lang=\"en\"><head><meta charset=\"utf-8\"><title>Recipe</title></head><body>...</body></html>", "<head><body><title>Recipe</title></body></head>", "<body lang=\"en\"><title>Recipe</title></body>"], answerIndex: 0, hint: "Look for doctype, language, metadata, title, and body in their usual places.", explanation: "This choice has the doctype and places language, metadata, title, and visible content in their correct locations." },
    ],
  },
  {
    title: "2. Tags, Elements, and Attributes",
    explanation: "Tags are the angle-bracket markers, such as <p> and </p>. An element is the complete unit: its opening tag, content, and usually a closing tag. Attributes add information to an opening tag as name/value pairs. For example, href tells a link where to go. Attribute values should be quoted. Some elements, such as img and meta, are void elements and do not wrap content or use a closing tag.",
    syntax: "<element attribute=\"value\">Content</element>\n<a href=\"https://example.com\">Visit the site</a>\n<img src=\"flower.jpg\" alt=\"A yellow flower\">",
    example: "<p title=\"A helpful note\">Hover over this sentence.</p>\n<a href=\"https://developer.mozilla.org/\">Read MDN</a>",
    expectedOutput: "You see a sentence and a “Read MDN” link. Hovering over the sentence may show its title text; selecting the link opens the MDN website.",
    useCases: ["Attributes configure elements, for example href on a link or src and alt on an image.", "The title attribute can provide supplementary information, though it should not replace visible instructions.", "The class attribute can identify elements for styling or scripting in later web lessons."],
    commonMistakes: ["Writing an attribute outside the opening tag.", "Leaving spaces around the equals sign is fine, but forgetting quotation marks around a value can cause parsing errors.", "Adding a closing tag to a void element such as img."],
    practice: ["Add a title attribute to a short paragraph and describe what happens when you hover.", "Create a link to a website using href and meaningful link text."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "In <a href=\"/about\">About us</a>, which part is the attribute?", options: ["href=\"/about\"", "About us", "</a>", "<a>"], answerIndex: 0, hint: "The attribute name and its value add information to the opening tag.", explanation: "href=\"/about\" is an attribute assignment on the opening a tag." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "What appears as clickable link text?", snippet: "<a href=\"/menu\">View the menu</a>", options: ["View the menu", "/menu", "href", "Nothing"], answerIndex: 0, hint: "The browser displays the content between the opening and closing tags.", explanation: "The text between the a tags is the link label; href supplies its destination." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "Which version correctly writes an image with its attributes?", snippet: "<img>", options: ["<img src=\"cat.jpg\" alt=\"A cat sleeping\">", "<img>cat.jpg</img>", "<img src cat.jpg alt A cat>", "</img src=\"cat.jpg\">"], answerIndex: 0, hint: "An image is a void element; put src and alt on its opening tag.", explanation: "The src and alt attributes belong in the img tag, and img has no closing tag." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose markup for a link whose visible label is “Course guide” and whose destination is guide.html.", options: ["<a href=\"guide.html\">Course guide</a>", "<a>href=\"guide.html\" Course guide</a>", "<a src=\"guide.html\">Course guide</a>", "<href=\"guide.html\">Course guide</href>"], answerIndex: 0, hint: "Links use the a element and its href attribute.", explanation: "The a element creates the link, href gives its destination, and the inner text names it." },
    ],
  },
  {
    title: "3. Headings and Paragraphs",
    explanation: "Headings describe the outline of a page. HTML provides six levels: h1 is the top-level heading, followed by h2 through h6 for nested sections. Choose a level based on the content hierarchy, not on its default visual size. Paragraph elements group sentences into readable blocks. Browsers add default spacing around headings and paragraphs.",
    syntax: "<h1>Page topic</h1>\n<h2>Section topic</h2>\n<p>A paragraph explains one related idea.</p>",
    example: "<h1>Growing Tomatoes</h1>\n<p>Tomatoes grow well in a sunny spot.</p>\n<h2>Watering</h2>\n<p>Check the soil regularly and water when it feels dry.</p>",
    expectedOutput: "A large main heading, a paragraph beneath it, a smaller “Watering” section heading, and a second paragraph with browser-default spacing.",
    useCases: ["Use headings to make long pages easier to scan and navigate.", "Screen readers can use heading levels as a document outline.", "Use paragraphs for prose rather than inserting many line-break elements."],
    commonMistakes: ["Choosing h1, h2, or h3 only because its text looks the right size.", "Skipping heading levels without a structural reason, such as jumping from h1 to h4.", "Using headings for text that is not actually a section title."],
    practice: ["Write a page with one h1, two h2 section headings, and a paragraph under each section.", "Reorder a heading outline so each subsection sits under the correct parent heading."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "Which element represents the highest-level heading?", options: ["<h1>", "<h6>", "<head>", "<title>"], answerIndex: 0, hint: "The heading sequence counts upward from its top-level element.", explanation: "h1 is the top-level heading; h6 is the lowest-level heading." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "Which text appears as the main heading, followed by a paragraph?", snippet: "<h1>Ocean Life</h1><p>Whales are mammals.</p>", options: ["Ocean Life as a large heading, then Whales are mammals. as a paragraph", "Both texts as headings", "Only Ocean Life", "The tags print as text"], answerIndex: 0, hint: "Browsers render each element according to its tag.", explanation: "h1 is rendered as a prominent heading, and p as a separate paragraph." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "What is the best structural correction for this outline?", snippet: "<h1>Birds</h1><h4>Migration</h4><p>...</p>", options: ["Change Migration to h2 because it is a section directly under Birds", "Change Birds to h4", "Replace both headings with p", "No heading can follow h1"], answerIndex: 0, hint: "A section directly under the main topic should be one level below it.", explanation: "h2 is the appropriate child heading under h1 when Migration is a first-level section." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose the best markup for a page title, a section title, and two sentences of prose.", options: ["<h1>Local History</h1><h2>Early days</h2><p>The town began as a village. It grew near the river.</p>", "<h2>Local History</h2><h5>Early days</h5><h5>The town began as a village.</h5>", "<p>Local History</p><p>Early days</p><h1>The town began as a village.</h1>"], answerIndex: 0, hint: "Use headings for the outline and a paragraph for connected prose.", explanation: "This markup gives the page a clear heading hierarchy and keeps prose in a paragraph." },
    ],
  },
  {
    title: "4. Text Formatting",
    explanation: "HTML has elements that describe the meaning of text. strong marks importance; em marks emphasis that changes how a sentence is understood. Browsers usually show them as bold and italic, respectively. b and i draw attention or distinguish a voice without adding the same importance or emphasis meaning. mark highlights text relevant to the current context. Prefer meaning-bearing elements when they fit.",
    syntax: "<strong>important</strong>\n<em>emphasized</em>\n<b>attention without added importance</b>\n<i>alternate voice or term</i>\n<mark>highlighted phrase</mark>",
    example: "<p><strong>Warning:</strong> Save your work before closing.</p>\n<p>Please read the <em>whole</em> instruction.</p>\n<p>The word <mark>HTML</mark> is highlighted here.</p>",
    expectedOutput: "“Warning:” appears bold, “whole” appears emphasized (usually italic), and “HTML” appears highlighted. Exact colors and styles can vary by browser.",
    useCases: ["Use strong for a warning or other important phrase.", "Use em when spoken emphasis changes the sentence meaning.", "Use mark to highlight a search match or a phrase discussed in context."],
    commonMistakes: ["Using strong just to make text bold when it is not important.", "Using em only to make text italic for decoration.", "Expecting HTML formatting elements to control a complete design system."],
    practice: ["Write a safety note with a strong warning and an em-emphasized action.", "Highlight a search term with mark and explain why it is relevant."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "Which element marks text with strong importance?", options: ["<strong>", "<span>", "<div>", "<small>"], answerIndex: 0, hint: "Choose the element whose name describes importance.", explanation: "strong marks content as having strong importance; browsers commonly render it bold." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "Which part is emphasized in the browser?", snippet: "<p>I <em>really</em> like books.</p>", options: ["really", "I", "books", "The entire page"], answerIndex: 0, hint: "The em element wraps the text it emphasizes.", explanation: "Only “really” is inside the em element and receives emphasis." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "A safety warning must be marked as important. What is the most meaningful fix?", snippet: "<p><b>Keep away from the edge.</b></p>", options: ["Use <strong>Keep away from the edge.</strong>", "Use <i>Keep away from the edge.</i>", "Use <span>Keep away from the edge.</span>", "Use <br>Keep away from the edge."], answerIndex: 0, hint: "The requirement is meaning, not just visual boldness.", explanation: "strong communicates importance in addition to its usual bold presentation." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Which choice uses both meaningful importance and contextual highlighting?", options: ["<p><strong>Notice:</strong> <mark>Registration closes Friday.</mark></p>", "<strong><mark><p>Notice</strong> closes Friday", "<p><b>Notice</p><mark>Registration closes Friday</mark></b>", "<p><em>Notice</mark> Registration closes Friday</em>"], answerIndex: 0, hint: "Check that elements are properly nested and used for their stated meaning.", explanation: "strong marks the notice as important; mark highlights the relevant deadline, with valid nesting." },
    ],
  },
  {
    title: "5. div and span",
    explanation: "div and span are generic containers. A div groups a larger block of related content and starts on its own line by default. A span groups a small piece of text inside a line. Neither adds meaning by itself, and neither normally changes how its text looks. They are useful when you need a hook to group content, but choose a meaningful element such as a heading or paragraph when one fits.",
    syntax: "<div>\n  <h2>Contact</h2>\n  <p>Email: <span>hello@example.com</span></p>\n</div>",
    example: "<div>\n  <p>Office hours: <span>Tuesday, 2–4 pm</span></p>\n  <p>Room 12</p>\n</div>",
    expectedOutput: "Two separate paragraphs appear on separate lines. “Tuesday, 2–4 pm” remains inside its paragraph; span does not create a new line or add default styling.",
    useCases: ["Use div to group related blocks when there is no more meaningful grouping element available.", "Use span to target a short phrase inside a paragraph for styling or scripting later.", "Use containers to keep related content together in a larger page structure."],
    commonMistakes: ["Using div for every element instead of choosing headings, paragraphs, or lists.", "Expecting span to create a new line.", "Expecting div or span to change visual styling automatically."],
    practice: ["Group a contact heading and two contact paragraphs in a div.", "Wrap just the opening time inside a paragraph in a span and observe that it stays inline."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "Which element is usually used as a generic inline container?", options: ["<span>", "<div>", "<section>", "<ul>"], answerIndex: 0, hint: "It can wrap a few words without starting a new line.", explanation: "span is a generic inline container." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "Will the second paragraph start on a new line?", snippet: "<p>Call <span>after lunch</span>.</p><p>Thanks!</p>", options: ["Yes; each p is a block paragraph", "No; span makes both paragraphs inline", "No; all tags are invisible", "Only after lunch starts a new line"], answerIndex: 0, hint: "The outer p elements determine the paragraph blocks.", explanation: "Each p is a separate paragraph. span stays inside the first paragraph and does not change that layout." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "You need a new block to group two related paragraphs. Which fix fits?", snippet: "<p>Hours: 9–5</p><p>Location: Room 4</p>", options: ["Wrap both paragraphs in a div", "Put both paragraphs inside one span", "Replace both paragraphs with br", "Wrap each letter in div"], answerIndex: 0, hint: "Use a block container for a group of block content.", explanation: "A div is a generic block container that can group related paragraphs." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose the valid markup that keeps a phrase inline within a paragraph.", options: ["<p>The event starts <span>at noon</span>.</p>", "<span><p>The event starts</span> at noon</p>", "<p>The event starts</p><span><p>at noon</span>", "<p><div>at noon</div></p>"], answerIndex: 0, hint: "Span can live inside a paragraph; a div should not be nested inside p.", explanation: "span is phrasing content and can wrap a phrase inside p. The other options have invalid or misleading nesting." },
    ],
  },
  {
    title: "6. Ordered and Unordered Lists",
    explanation: "Lists group related items. Use ul when the order does not matter, such as a collection of ingredients. Use ol when the sequence matters, such as numbered instructions. Put every item inside an li element. Browsers add default bullets or numbering and indentation. Lists can be nested by placing a child list inside the relevant li.",
    syntax: "<ul>\n  <li>Apples</li>\n  <li>Oranges</li>\n</ul>\n\n<ol>\n  <li>Preheat the oven</li>\n  <li>Mix the ingredients</li>\n</ol>",
    example: "<h2>How to make tea</h2>\n<ol>\n  <li>Boil water.</li>\n  <li>Add a tea bag.</li>\n  <li>Wait three minutes.</li>\n</ol>\n<h2>Optional additions</h2>\n<ul><li>Milk</li><li>Lemon</li></ul>",
    expectedOutput: "A numbered three-step sequence appears under “How to make tea”. A separate bulleted list shows Milk and Lemon under “Optional additions”.",
    useCases: ["Use ordered lists for instructions, rankings, or any sequence where position matters.", "Use unordered lists for ingredients, features, or collections without a required sequence.", "Use nested lists to show sub-steps or grouped choices."],
    commonMistakes: ["Putting text directly inside ul or ol instead of inside li.", "Choosing ul or ol based on how the markers look rather than whether order matters.", "Closing li tags in the wrong order or nesting a child list outside its parent li."],
    practice: ["Write a three-step morning routine as an ordered list.", "Write five favorite foods as an unordered list and add one nested category."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "Which list is best for numbered steps that must be followed in order?", options: ["<ol>", "<ul>", "<li>", "<p>"], answerIndex: 0, hint: "The element name starts with the word for ordered.", explanation: "ol represents an ordered list, commonly displayed with numbers." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "Which markers will the browser normally show?", snippet: "<ul><li>Tea</li><li>Coffee</li></ul>", options: ["Two bullets, one for Tea and one for Coffee", "Numbers 1 and 2", "No markers", "One bullet for both words"], answerIndex: 0, hint: "This is an unordered list with two list items.", explanation: "Browsers normally display a bullet for each li in a ul." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "Which fix gives each item valid list structure?", snippet: "<ol>First<li>Second</li></ol>", options: ["<ol><li>First</li><li>Second</li></ol>", "<ol><p>First</p><p>Second</p></ol>", "<li>First</li><ol>Second</ol>", "<ol>First</ol><li>Second</li>"], answerIndex: 0, hint: "Each list item belongs inside its own li element.", explanation: "An ol should contain li items; this version correctly wraps both entries." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose markup for a checklist of supplies where order does not matter.", options: ["<ul><li>Notebook</li><li>Pen</li></ul>", "<ol><p>Notebook</p><p>Pen</p></ol>", "<ul>Notebook Pen</ul>", "<li><ul>Notebook</ul></li>"], answerIndex: 0, hint: "Use an unordered list and one list item per supply.", explanation: "ul is appropriate because supply order does not matter, and every entry is an li." },
    ],
  },
];

export const htmlMilestoneOneAssignments = [
  {
    title: "Create an About Me page",
    requirements: ["Give the document a useful title and language.", "Add one main heading and short paragraphs about yourself.", "Use at least two text-formatting elements with meaning.", "Group related content using div and use span for a short inline detail.", "Add an unordered list of interests or skills."],
    criteria: ["The page has a valid doctype, head, title, and body.", "Headings and paragraphs create a clear outline.", "Formatting elements match the meaning of the text.", "The div and span are used in appropriate block/inline roles.", "The list uses ul and li correctly."],
  },
  {
    title: "Create a Restaurant Menu",
    requirements: ["Name the restaurant and organize at least two menu sections.", "Include at least three items per section with a short description and price.", "Use headings, paragraphs, and at least one ordered or unordered list appropriately.", "Use text formatting to draw attention to item names or a special note."],
    criteria: ["The content is organized with a logical heading hierarchy.", "Every menu entry is easy to identify and read.", "Lists and list items are correctly nested.", "Text formatting communicates emphasis or importance rather than decoration alone."],
  },
  {
    title: "Create a Wikipedia-style article",
    requirements: ["Choose a topic and write an original, factual introduction.", "Create at least three sections with headings and paragraphs.", "Add a numbered contents list that names the sections.", "Use an unordered list for related facts where useful and format important terms meaningfully."],
    criteria: ["The page has one clear top-level heading and a sensible section outline.", "Paragraphs explain the topic in the student's own words.", "The ordered contents and unordered fact list use appropriate list types.", "Elements are properly opened, closed, and nested."],
  },
];

export const htmlMilestoneOneInterviewQuestions: [string, string][] = [
  ["What is the difference between a tag and an element?", "A tag is the markup marker, such as <p>. An element includes its opening and closing tags and the content between them."],
  ["What belongs in head and what belongs in body?", "head contains page metadata, such as title and character encoding. body contains the visible page content."],
  ["When should you choose an ordered list?", "Choose ol when the sequence matters, such as steps in a process."],
  ["How do strong and b differ?", "strong communicates strong importance. b draws attention without adding that meaning."],
  ["What is the difference between div and span?", "div is a generic block container. span is a generic inline container."],
  ["Why should heading levels reflect structure?", "A logical heading outline helps readers scan the page and helps assistive technology expose its structure."],
];

export const htmlMilestoneTwoTopics: HtmlTopicContent[] = [
  {
    title: "1. Links and href",
    explanation: "An anchor element creates a link. Its href attribute tells the browser where the link should go. A URL can point to another website, another file in your project, an email address, or a place on the current page using an element id. The text between the opening and closing a tags becomes the link's accessible, clickable name. Write link text that explains the destination instead of using vague phrases such as “click here”.",
    syntax: "<a href=\"destination\">Descriptive link text</a>\n<a href=\"#contact\">Contact section</a>\n<a href=\"mailto:hello@example.com\">Email us</a>",
    example: "<h1>Plan a visit</h1>\n<p><a href=\"https://www.example.org/park\">Read the park visitor guide</a></p>\n<h2 id=\"hours\">Opening hours</h2>\n<p><a href=\"#hours\">Jump to opening hours</a></p>",
    expectedOutput: "The visitor guide text appears as a clickable link. The second link moves the page view to the Opening hours heading. Browser default link colors and underlines can vary.",
    useCases: ["Link pages and files together so people can navigate a site.", "Use a fragment link such as #hours to jump to an element with that id.", "Use mailto: links when a visitor should start an email."],
    commonMistakes: ["Forgetting href, which leaves an anchor without a destination.", "Using link text such as “here” that does not explain the destination out of context.", "Linking to #section-name when no element has that id."],
    practice: ["Add one link to another page in your project and one external link with descriptive text.", "Create a section with an id and a link that jumps to it."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "Which attribute sets the destination of a link?", options: ["href", "src", "alt", "scope"], answerIndex: 0, hint: "It is short for a reference to the destination.", explanation: "href specifies the URL or page location the link points to." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "What happens when a reader activates this link?", snippet: "<a href=\"#details\">Read details</a><h2 id=\"details\">Details</h2>", options: ["The page jumps to the Details heading", "A new image opens", "The heading is deleted", "The text is submitted as a form"], answerIndex: 0, hint: "A URL fragment points to an id in the same document.", explanation: "The fragment #details matches id=\"details\", so the browser navigates to that heading." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "Which change makes this external link useful and descriptive?", snippet: "<a>click here</a>", options: ["<a href=\"https://example.org/guide\">Read the visitor guide</a>", "<a src=\"https://example.org/guide\">click here</a>", "<href=\"https://example.org/guide\">Visitor guide</href>", "<a id=\"https://example.org/guide\">click here</a>"], answerIndex: 0, hint: "An anchor needs href, and its text should make sense on its own.", explanation: "The a element uses href for its destination and descriptive text for its clickable label." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose a link that opens a message to the listed address.", options: ["<a href=\"mailto:team@example.org\">Email the team</a>", "<a src=\"team@example.org\">Email the team</a>", "<mailto href=\"team@example.org\">Email the team</mailto>", "<a href=\"#team@example.org\">Email the team</a>"], answerIndex: 0, hint: "Email links use the mailto: URL scheme.", explanation: "A mailto: href asks the browser to open the user's configured email application." },
    ],
  },
  {
    title: "2. Images and alt text",
    explanation: "The img element places an image in a page. The src attribute points to its image file. The alt attribute provides a text alternative: describe the useful information the image communicates, not every visual detail. If an image is only decoration and adds no information, use alt=\"\" so assistive technology can skip it. Use figure and figcaption when an image needs a visible caption.",
    syntax: "<img src=\"images/flower.jpg\" alt=\"Yellow flower beside a garden path\">\n<figure>\n  <img src=\"images/bridge.jpg\" alt=\"Stone bridge over a stream\">\n  <figcaption>The old bridge in spring</figcaption>\n</figure>",
    example: "<h1>Garden walk</h1>\n<figure>\n  <img src=\"images/garden.jpg\" alt=\"A path between rows of flowers\">\n  <figcaption>The north garden path</figcaption>\n</figure>",
    expectedOutput: "The garden image appears, followed by its visible caption. If the image cannot load, the browser can show the alt text instead.",
    useCases: ["Alt text makes informative images understandable to people who cannot see them.", "Captions provide context that is visible to everyone.", "A non-empty alt value is useful when an image carries information not already present in nearby text."],
    commonMistakes: ["Omitting alt on an img element.", "Repeating a nearby caption word-for-word as alt when it adds no further information.", "Using a filename or “image of” instead of conveying the image's relevant meaning."],
    practice: ["Add an image with an alt description that communicates why the image matters in the page.", "Add a figure caption and decide whether the caption already communicates the same information as the image."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "What is the main purpose of alt text on an informative image?", options: ["To communicate the image's relevant information as text", "To set the image's file path", "To add a visible caption under every image", "To resize the image"], answerIndex: 0, hint: "Think of people who cannot see the image or when the file fails to load.", explanation: "Alt provides a text alternative for image information; src identifies the file." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "What text can the browser show if the image file cannot load?", snippet: "<img src=\"missing.jpg\" alt=\"A red bicycle by the gate\">", options: ["A red bicycle by the gate", "missing.jpg only", "The text inside src and alt", "Nothing can appear"], answerIndex: 0, hint: "The alternative description is intended to stand in when the image is unavailable.", explanation: "The alt value is the text alternative and may be displayed if the image fails to load." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "Which version provides a text alternative for an informative image?", snippet: "<img src=\"map.jpg\">", options: ["<img src=\"map.jpg\" alt=\"Map showing the library two blocks north\">", "<img alt src=\"map.jpg\">", "<img src=\"map.jpg\">Map", "<img src=\"map.jpg\" title=\"Map\">"], answerIndex: 0, hint: "The text alternative belongs in the alt attribute.", explanation: "The first version includes a useful alt description. title is not a substitute for alt." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "A purely decorative border texture adds no information. Which alt value is appropriate?", options: ["alt=\"\"", "alt=\"decorative border texture image\"", "No alt attribute", "alt=\"border.jpg\""], answerIndex: 0, hint: "An empty alt tells assistive technology to ignore a decorative image.", explanation: "Use alt=\"\" for decorative images so they do not add noise to screen-reader output." },
    ],
  },
  {
    title: "3. Relative file paths",
    explanation: "A file path tells the browser where a page should find an image or another file. A relative path is read from the location of the current HTML file. If index.html is beside an images folder, use images/photo.jpg. Use ../ to move up one folder. Paths are case-sensitive on many web servers, so match folder and file capitalization exactly.",
    syntax: "<!-- index.html and the images folder are siblings -->\n<img src=\"images/photo.jpg\" alt=\"...\">\n\n<!-- current page is inside pages/; move up, then into images/ -->\n<img src=\"../images/photo.jpg\" alt=\"...\">",
    example: "project/\n├── index.html\n├── images/\n│   └── lake.jpg\n└── pages/\n    └── trip.html\n\n<!-- In index.html -->\n<img src=\"images/lake.jpg\" alt=\"Lake at sunrise\">\n<!-- In pages/trip.html -->\n<img src=\"../images/lake.jpg\" alt=\"Lake at sunrise\">",
    expectedOutput: "Both pages display the same lake image. The path from trip.html starts with ../ because that page is one folder deeper.",
    useCases: ["Relative paths keep project files portable when a whole folder is moved.", "They connect pages to shared images, audio, video, and documents in an organized project.", "A consistent assets folder makes larger projects easier to navigate."],
    commonMistakes: ["Counting ../ from the project root rather than from the current HTML file.", "Using the wrong file extension or letter capitalization.", "Starting with a slash when you meant a path relative to the current page."],
    practice: ["Draw a small folder tree with index.html and images/photo.jpg, then write the image path.", "Move the page into a pages folder and update its relative path to the same image."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "In a relative path, what does ../ mean?", options: ["Move up to the parent folder", "Open the next image", "Start at the web root", "Use the current file name"], answerIndex: 0, hint: "It moves one directory level toward the containing folder.", explanation: "../ means move to the parent folder relative to the current document." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "The page is at project/pages/trip.html. Where does this path point?", snippet: "<img src=\"../images/lake.jpg\" alt=\"Lake\">", options: ["project/images/lake.jpg", "project/pages/images/lake.jpg", "project/lake.jpg", "A website named images"], answerIndex: 0, hint: "Go up from pages to project, then enter images.", explanation: "../ moves from pages to project; images/lake.jpg then identifies the image." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "index.html is inside site/pages and the photo is in site/images. Which src path reaches it?", snippet: "site/pages/index.html → site/images/photo.jpg", options: ["../images/photo.jpg", "images/photo.jpg", "../../photo.jpg", "/pages/images/photo.jpg"], answerIndex: 0, hint: "Move up from pages to site, then enter images.", explanation: "The page is one folder below site, so ../ returns to site before entering images." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose the path from blog/posts/weekend.html to blog/assets/map.png.", options: ["../../assets/map.png", "../assets/map.png", "assets/map.png", "../../../blog/assets/map.png"], answerIndex: 1, hint: "Move up from posts to blog, then enter assets.", explanation: "The current directory is blog/posts. One ../ reaches blog, and assets/map.png then reaches blog/assets/map.png." },
    ],
  },
  {
    title: "4. Tables with headers",
    explanation: "Use an HTML table for information that compares values in rows and columns, not to position a page layout. A caption describes the table. Use th for header cells and td for ordinary data cells. Add scope=\"col\" to column headers and scope=\"row\" to row headers so assistive technology can connect a value to its heading. Group headings and data with thead and tbody when that helps keep the table clear.",
    syntax: "<table>\n  <caption>Quiz results</caption>\n  <thead><tr><th scope=\"col\">Name</th><th scope=\"col\">Score</th></tr></thead>\n  <tbody><tr><th scope=\"row\">Mina</th><td>92</td></tr></tbody>\n</table>",
    example: "<table>\n  <caption>Weekly reading</caption>\n  <thead>\n    <tr><th scope=\"col\">Day</th><th scope=\"col\">Pages</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope=\"row\">Monday</th><td>12</td></tr>\n    <tr><th scope=\"row\">Tuesday</th><td>18</td></tr>\n  </tbody>\n</table>",
    expectedOutput: "A caption appears with two columns labeled Day and Pages. Two rows show Monday—12 and Tuesday—18. Browser default table styling may be minimal until styles are added.",
    useCases: ["Use tables for report cards, schedules, and other genuinely two-dimensional data.", "Captions explain a table's purpose before someone reads its values.", "Header cells and scope make row/column relationships clearer for screen-reader users."],
    commonMistakes: ["Using tables to lay out unrelated page content.", "Making every cell td so the table has no semantic headers.", "Leaving cells out of a row so the columns no longer line up."],
    practice: ["Build a two-column table of subjects and scores with a caption and column headers.", "Add row headers for each subject and check that every row has the same number of cells."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "Which element creates a table header cell?", options: ["<th>", "<td>", "<tr>", "<caption>"], answerIndex: 0, hint: "Its name includes the word header.", explanation: "th marks a table header cell; td marks ordinary data." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "How many data rows appear in the tbody?", snippet: "<table><tbody><tr><td>A</td></tr><tr><td>B</td></tr></tbody></table>", options: ["Two", "One", "Three", "None"], answerIndex: 0, hint: "Count the tr elements inside tbody.", explanation: "There are two tr elements, so two table rows appear." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "A subject name labels values across its row. What should the subject cell be?", snippet: "<tr><td>Science</td><td>88</td></tr>", options: ["<th scope=\"row\">Science</th>", "<td scope=\"col\">Science</td>", "<caption>Science</caption>", "<tr>Science</tr>"], answerIndex: 0, hint: "This is a header for a row, not a data value or column header.", explanation: "Use th with scope=\"row\" for a row heading such as a subject name." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose the strongest accessible header row for a two-column report card.", options: ["<tr><th scope=\"col\">Subject</th><th scope=\"col\">Mark</th></tr>", "<tr><td>Subject</td><td>Mark</td></tr>", "<tr><th scope=\"row\">Subject</th><td>Mark</td></tr>", "<td><th>Subject</th>Mark</td>"], answerIndex: 0, hint: "Both cells label columns, so give each a column scope.", explanation: "Both column labels should be th cells with scope=\"col\"." },
    ],
  },
  {
    title: "5. Audio, video, and embedded content",
    explanation: "The audio and video elements let a page play media with browser-provided controls. Put controls on them so visitors can start, pause, and adjust playback. A video can include source elements for alternate file formats and fallback text. An iframe embeds another page or service, such as a map; give it a descriptive title so people using assistive technology know what the frame contains. Only embed content from a source you trust.",
    syntax: "<audio controls src=\"media/intro.mp3\">Audio playback is not supported.</audio>\n<video controls width=\"480\">\n  <source src=\"media/clip.mp4\" type=\"video/mp4\">\n  Video playback is not supported.\n</video>\n<iframe title=\"Map of the city center\" src=\"https://www.openstreetmap.org/export/embed.html?...\"></iframe>",
    example: "<h2>Listen to the harbor</h2>\n<audio controls src=\"media/harbor.mp3\">Your browser cannot play this audio.</audio>\n<h2>Explore the map</h2>\n<iframe title=\"Map of the harbor\" src=\"https://www.openstreetmap.org/export/embed.html?bbox=4.88%2C52.36%2C4.91%2C52.38&amp;layer=mapnik\" width=\"600\" height=\"400\"></iframe>",
    expectedOutput: "The browser displays an audio player with playback controls and a map inside a rectangular frame. The media player only works if its file path exists; the map requires an internet connection.",
    useCases: ["Add a recorded interview or spoken introduction with audio controls.", "Show a short demonstration video with controls and fallback text.", "Embed a map to help visitors find a travel destination."],
    commonMistakes: ["Forgetting controls, leaving visitors unable to start playback.", "Using a file path that does not match the project folders.", "Leaving an iframe without a descriptive title or embedding an untrusted site."],
    practice: ["Add an audio player with controls and fallback text to a page.", "Add a titled iframe for a map or other trusted embed and describe what a visitor will find there."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Beginner", prompt: "Which attribute shows built-in playback controls?", options: ["controls", "alt", "scope", "href"], answerIndex: 0, hint: "It is a boolean attribute on audio and video.", explanation: "Adding controls asks the browser to display its media playback controls." },
      { kind: "predict-output", difficulty: "Beginner", prompt: "What interface does this markup request?", snippet: "<audio controls src=\"sound.mp3\"></audio>", options: ["An audio player with playback controls", "A link to sound.mp3", "A video with captions", "A visible image"], answerIndex: 0, hint: "The element name identifies the media type.", explanation: "audio creates an audio player, and controls requests its playback controls." },
      { kind: "find-and-fix", difficulty: "Intermediate", prompt: "Which change makes this embedded map frame more accessible?", snippet: "<iframe src=\"map.html\"></iframe>", options: ["Add title=\"Map of the trail entrance\"", "Add alt=\"Map\" to iframe", "Replace src with href", "Remove the iframe closing tag"], answerIndex: 0, hint: "An iframe uses a title to name the embedded browsing context.", explanation: "A descriptive title tells users what the iframe contains. alt is not an iframe attribute." },
      { kind: "code-challenge", difficulty: "Challenge", prompt: "Choose a video element that lets a visitor play the file and provides fallback text.", options: ["<video controls><source src=\"clip.mp4\" type=\"video/mp4\">Video cannot be played.</video>", "<video src=\"clip.mp4\">", "<iframe alt=\"clip.mp4\"></iframe>", "<video href=\"clip.mp4\"><img></video>"], answerIndex: 0, hint: "Use controls, a source child, and text inside the video element.", explanation: "The video has controls, a typed source, and fallback text for unsupported playback." },
    ],
  },
];

export const htmlMilestoneTwoAssignments = [
  {
    title: "Create an Image Gallery",
    requirements: ["Create a page with at least six images arranged in a clear gallery order.", "Use meaningful alt text for informative images and empty alt text for any purely decorative images.", "Use a caption for images that need visible context.", "Keep image files in an assets folder and use correct relative paths."],
    criteria: ["Every img has an appropriate alt value.", "All image paths work from the location of the HTML file.", "Captions and image descriptions are not confused with one another.", "The gallery has a clear page heading and understandable image order."],
  },
  {
    title: "Create a Student Report Card",
    requirements: ["Show a student name, term, and at least four subjects with scores.", "Use a table caption, column headers, row headers, and data cells.", "Add scope values so headers are associated with the correct rows or columns.", "Include a summary row such as total or average, and make sure each row has consistent cells."],
    criteria: ["The table is used for tabular data and has a useful caption.", "Column headers use th with scope=col.", "Subject row headers use th with scope=row.", "Data uses td and the table has a consistent column structure."],
  },
  {
    title: "Create a Travel Blog",
    requirements: ["Write a destination article with at least two sections and multiple images with useful alt text.", "Include an internal link to a section in the same page and an external link to a visitor resource.", "Embed audio, video, or a map from a trusted source.", "Give the embedded content a useful title and include fallback or explanatory text where appropriate."],
    criteria: ["The internal fragment link matches an existing id and works.", "The external link destination and link text are clear.", "Images use working relative paths and appropriate alt text.", "Embedded media has controls or an accessible title and is explained to the reader."],
  },
];

export const htmlMilestoneTwoInterviewQuestions: [string, string][] = [
  ["What does href do on an anchor element?", "It specifies the link destination, which can be a page, URL, fragment, or supported URL scheme such as mailto:."],
  ["When should alt text be empty?", "Use alt=\"\" for an image that is purely decorative and communicates no information not already available nearby."],
  ["How do you link from a nested page to a sibling folder?", "Use a relative path and ../ to move to the parent directory, then enter the target folder."],
  ["Why are table headers important?", "Header cells describe rows or columns and help people understand the relationship between each data value and its label."],
  ["Why should an iframe have a title?", "The title gives assistive technology users a concise name for the embedded browsing context."],
  ["When would you choose audio/video elements over an iframe?", "Use native audio or video when embedding a media file you control; use an iframe for a separate page or third-party embed such as a map."],
];

export const htmlMilestoneThreeTopics: HtmlTopicContent[] = [
  {
    title: "1. Forms and action / method",
    explanation: "A form groups controls so a visitor can send information. The action attribute names the destination that receives the submission. The method attribute tells the browser how to send it. GET places form values in the destination URL and is useful for searches or filters that can be shared. POST sends values in the request body and is common when a visitor is creating or changing information. POST does not by itself encrypt data; a real site also needs a secure connection and a server that accepts the request.",
    syntax: "<form action=\"/contact\" method=\"post\">\n  <!-- labeled form controls go here -->\n  <button type=\"submit\">Send message</button>\n</form>",
    syntaxNotes: ["form groups controls submitted together.", "action is the destination URL; the server must provide that route.", "method is usually get for read-only searches or post for new or changed information.", "A submit button sends the form using its action and method."],
    example: "<form action=\"/search\" method=\"get\">\n  <label for=\"query\">Search articles</label>\n  <input id=\"query\" name=\"q\">\n  <button type=\"submit\">Search</button>\n</form>",
    expectedOutput: "You see a Search articles label, a text field, and a Search button. Submitting sends the named value to /search using GET; a server response depends on the site that handles that URL.",
    useCases: ["Use GET for searches and filters where the resulting URL can be revisited or shared.", "Use POST when a form creates or updates information, such as sending a message or registration.", "Choose an action route that your website actually provides."],
    commonMistakes: ["Leaving action pointed at a route that does not exist; fix it by confirming the receiving page or endpoint.", "Using GET for private information that should not appear in the URL; use POST for a new or changed record and protect the site with HTTPS.", "Assuming POST alone makes information private or secure; HTTPS and server-side handling are also needed."],
    practice: ["Sketch a search form and choose a GET method because its result can be bookmarked.", "Sketch a contact form and identify its action route and a suitable method."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Easy", prompt: "What does action on a form specify?", options: ["Where the browser sends the submitted form", "The label shown above each field", "Whether a field is required", "The text shown in a browser tab"], answerIndex: 0, hint: "It is the destination address for the submission.", explanation: "action names the URL that will receive the form submission." },
      { kind: "predict-output", difficulty: "Medium", prompt: "Which method is used when this form is submitted?", snippet: "<form action=\"/search\" method=\"get\"><input name=\"q\"><button type=\"submit\">Go</button></form>", options: ["GET, with the named value included in the request URL", "POST, with no request URL", "No submission because method is missing", "The button resets the form"], answerIndex: 0, hint: "Read the method value on the form element.", explanation: "method=\"get\" asks the browser to submit using GET; named values are included in the request URL." },
      { kind: "find-and-fix", difficulty: "Medium", prompt: "A form should send a new contact request to /contact. Which correction is appropriate?", snippet: "<form><input name=\"email\"><button>Send</button></form>", options: ["Add action=\"/contact\" and method=\"post\" to the form", "Put href=\"/contact\" on the input", "Set type=\"post\" on the button", "Add required to the form element"], answerIndex: 0, hint: "The destination and submission method belong on the form.", explanation: "action and method are form attributes. The server still needs to implement the /contact route." },
      { kind: "code-challenge", difficulty: "Challenging", prompt: "Choose suitable form markup for a shareable article search.", options: ["<form action=\"/articles\" method=\"get\"><label for=\"term\">Search</label><input id=\"term\" name=\"q\"><button type=\"submit\">Find</button></form>", "<form href=\"/articles\" method=\"get\"><input id=\"term\"><button>Find</button></form>", "<form action=\"/articles\" type=\"get\"><label>Search</label><input name=\"q\"></form>", "<button action=\"/articles\" method=\"get\">Find</button>"], answerIndex: 0, hint: "The form needs action and method; its control needs a label and submitted name.", explanation: "The form specifies its route and GET method; the input is labeled and named so its value can be submitted." },
    ],
  },
  {
    title: "2. Inputs and labels",
    explanation: "An input creates a form control, such as a text box, email field, checkbox, or date picker. A label tells visitors what to enter and gives the control an accessible name. Connect them by making the label's for value exactly match the input's id. Clicking the label then focuses or toggles its control. Placeholder text is only a temporary example inside a field; it disappears during entry and is not a replacement for a label.",
    syntax: "<label for=\"email\">Email address</label>\n<input id=\"email\" name=\"email\" type=\"email\">",
    syntaxNotes: ["label is the readable name or instruction for a form control.", "for on the label must match the control's id exactly.", "id identifies this control in the document; each id should be unique.", "type chooses the kind of input and can enable useful browser behavior."],
    example: "<label for=\"birthday\">Date of birth</label>\n<input id=\"birthday\" name=\"birthday\" type=\"date\">\n<p>Choose the date shown on your school record.</p>",
    expectedOutput: "A Date of birth label appears beside a browser date control, followed by an instruction. Selecting the label focuses the date control.",
    useCases: ["Use email, date, checkbox, and other input types to match the information being collected.", "A connected label helps all visitors identify a field and supports screen readers and voice control.", "A visible label stays available after a visitor starts typing."],
    commonMistakes: ["Using placeholder text instead of a visible label; add a label that remains visible while typing.", "Letting label for and input id differ; make the two values match exactly.", "Reusing an id; give every control its own unique id."],
    practice: ["Create labeled name and email fields, each with a matching for and id.", "Make a checkbox whose label can be clicked to toggle it."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Easy", prompt: "How do you explicitly connect a label to an input?", options: ["Match label for with input id", "Match label id with input name", "Put the label text in placeholder only", "Give both elements the same type"], answerIndex: 0, hint: "The label points to the unique identifier of its control.", explanation: "The label's for value must match the input's id." },
      { kind: "predict-output", difficulty: "Medium", prompt: "What happens when a visitor clicks the text “Email”?", snippet: "<label for=\"email\">Email</label><input id=\"email\" type=\"email\">", options: ["The email field receives focus", "The form submits", "The email field becomes required", "Nothing; the label is connected to another id"], answerIndex: 0, hint: "Compare the label for value with the input id.", explanation: "Both values are email, so the label is associated with that control and clicking it focuses the field." },
      { kind: "find-and-fix", difficulty: "Medium", prompt: "Which fix gives this field a persistent accessible name?", snippet: "<input type=\"email\" placeholder=\"Email address\">", options: ["Add <label for=\"email\">Email address</label> and id=\"email\" to the input", "Change the placeholder to name=\"email\"", "Add alt=\"Email address\" to the input", "Replace input with a button"], answerIndex: 0, hint: "Give the input an id and associate a visible label using for.", explanation: "A connected visible label remains available while typing. A placeholder is not a substitute for a label." },
      { kind: "code-challenge", difficulty: "Challenging", prompt: "Choose correctly connected markup for a phone field.", options: ["<label for=\"phone\">Phone number</label><input id=\"phone\" name=\"phone\" type=\"tel\">", "<label id=\"phone\">Phone number</label><input for=\"phone\" type=\"tel\">", "<label for=\"phone-number\">Phone number</label><input id=\"phone\" type=\"tel\">", "<input type=\"tel\" placeholder=\"Phone number\">"], answerIndex: 0, hint: "Match for and id exactly; name identifies the submitted value.", explanation: "The label for and input id both equal phone, and name gives the value its submission key." },
    ],
  },
  {
    title: "3. Buttons and input types",
    explanation: "Choose an input type that matches the information, such as email for an email address or checkbox for an independent choice. Buttons inside forms submit by default, so set the type explicitly. Use submit to send the form, reset only when the user truly needs to clear all entered values, and button for an action that does not submit. Always give a button a clear text name.",
    syntax: "<input type=\"email\" name=\"email\">\n<button type=\"submit\">Send</button>\n<button type=\"reset\">Clear entries</button>\n<button type=\"button\">Check availability</button>",
    syntaxNotes: ["type on input selects a control such as text, email, date, checkbox, or radio.", "type=\"submit\" sends the form.", "type=\"reset\" restores controls to their initial values.", "type=\"button\" does not submit the form by itself."],
    example: "<form action=\"/signup\" method=\"post\">\n  <label for=\"email-address\">Email</label>\n  <input id=\"email-address\" name=\"email\" type=\"email\">\n  <button type=\"submit\">Create account</button>\n</form>",
    expectedOutput: "The browser shows a labeled email field and a Create account button. Activating the button submits the form; the browser may check that a typed value resembles an email address.",
    useCases: ["An email input provides an appropriate keyboard on many devices and basic format checking.", "Checkboxes work for independent yes/no choices; radio inputs work for one choice from a group.", "Explicit button types prevent an unrelated button from accidentally submitting a form."],
    commonMistakes: ["Using a generic text input when a suitable type exists; choose email, date, checkbox, or another matching type.", "Leaving a utility button as the default submit button; set type=\"button\" explicitly.", "Using reset without warning; explain that it clears entered values or leave it out."],
    practice: ["Choose input types for email, date of birth, and an agreement checkbox.", "Add a submit button and a non-submitting button with clear labels."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Easy", prompt: "Which button type sends a form?", options: ["submit", "button", "reset", "send"], answerIndex: 0, hint: "It names the action that submits the form's values.", explanation: "type=\"submit\" activates form submission." },
      { kind: "predict-output", difficulty: "Medium", prompt: "What happens when this button is activated inside a form?", snippet: "<form action=\"/apply\" method=\"post\"><button type=\"button\">Preview</button></form>", options: ["It does not submit the form by itself", "It always submits the form", "It clears every field", "It changes to an email input"], answerIndex: 0, hint: "Read the explicit type attribute.", explanation: "type=\"button\" has no automatic submit behavior." },
      { kind: "find-and-fix", difficulty: "Medium", prompt: "A button should clear the current field values. Which correction is right?", snippet: "<button type=\"submit\">Clear</button>", options: ["Use type=\"reset\" and label it clearly", "Use type=\"email\"", "Remove its text label", "Move action and method onto the button"], answerIndex: 0, hint: "Reset is the button type that restores controls to their initial values.", explanation: "type=\"reset\" resets form controls. Explain the effect because clearing entered work may surprise users." },
      { kind: "code-challenge", difficulty: "Challenging", prompt: "Choose a checkbox for an agreement followed by an explicit submit control.", options: ["<label for=\"agree\"><input id=\"agree\" name=\"agree\" type=\"checkbox\"> I agree</label><button type=\"submit\">Continue</button>", "<input type=\"submit\" name=\"agree\"><button type=\"checkbox\">I agree</button>", "<label>I agree</label><input type=\"text\"><button type=\"button\">Continue</button>", "<input type=\"button\" name=\"agree\"><button type=\"submit\"></button>"], answerIndex: 0, hint: "A checkbox represents a toggle; the submit button needs a readable name.", explanation: "The checkbox is labeled and named, and the submit button clearly says what it does." },
    ],
  },
  {
    title: "4. name, required, and autocomplete",
    explanation: "The name attribute gives a control its key when a form is submitted. Without name, a filled control is generally not included in submitted form data. required asks the browser to stop a normal submission until the visitor provides a value. autocomplete gives the browser a standard clue about what kind of information belongs in a field, so it may offer a saved value. These attributes help the browser and server process a form, but they do not replace a clear label.",
    syntax: "<label for=\"full-name\">Full name</label>\n<input id=\"full-name\" name=\"fullName\" autocomplete=\"name\" required>\n<label for=\"email-address\">Email</label>\n<input id=\"email-address\" name=\"email\" type=\"email\" autocomplete=\"email\" required>",
    syntaxNotes: ["name is the key used for this value when the form is submitted.", "required is a boolean attribute; its presence means a value is required.", "autocomplete uses standard hints such as name, given-name, email, or tel.", "id connects the label to the field; it is separate from the submitted name."],
    example: "<form action=\"/register\" method=\"post\">\n  <label for=\"student-name\">Student name</label>\n  <input id=\"student-name\" name=\"studentName\" autocomplete=\"name\" required>\n  <button type=\"submit\">Register</button>\n</form>",
    expectedOutput: "The browser displays a labeled field and Register button. Submitting while the required field is blank triggers browser validation; the browser may offer a saved name because of autocomplete.",
    useCases: ["name lets the receiving site tell which submitted value is the email, student name, or phone.", "required is useful for values a form cannot process without, such as a contact email.", "autocomplete helps people complete familiar personal details faster and reduces typing errors."],
    commonMistakes: ["Adding id but forgetting name; add a meaningful name for the submitted value.", "Using required on optional fields; remove required unless the form truly needs that value.", "Using placeholder as the only instruction; add a visible label and nearby help."],
    practice: ["Add a required email field with a unique id, a submission name, and autocomplete=\"email\".", "Choose whether a secondary phone field should be required or optional and explain why."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Easy", prompt: "Which attribute gives a submitted value its key?", options: ["name", "id", "placeholder", "autocomplete"], answerIndex: 0, hint: "The receiving form handler uses this value to identify the field.", explanation: "name is sent with the field's value as its submission key. id is used for document identification and label association." },
      { kind: "predict-output", difficulty: "Medium", prompt: "What does the browser normally do if this required field is blank on submit?", snippet: "<input name=\"email\" type=\"email\" required>", options: ["Block normal submission and ask for a value", "Submit the field as an empty email automatically", "Create a label", "Send the value in the URL"], answerIndex: 0, hint: "required requests a value before ordinary form submission.", explanation: "Native constraint validation prevents a normal submission until the required control has a value." },
      { kind: "find-and-fix", difficulty: "Medium", prompt: "The label works, but the email value is missing from submitted data. What is the likely fix?", snippet: "<label for=\"email\">Email</label><input id=\"email\" type=\"email\">", options: ["Add name=\"email\" to the input", "Change id to name and remove the label", "Add autocomplete to the form only", "Replace type=email with type=submit"], answerIndex: 0, hint: "Label association and submitted key are separate jobs.", explanation: "The matching for/id connects the label, but the field also needs name to be included under a key in form data." },
      { kind: "code-challenge", difficulty: "Challenging", prompt: "Choose a suitable required email field that can use a browser-saved email address.", options: ["<label for=\"email\">Email</label><input id=\"email\" name=\"email\" type=\"email\" autocomplete=\"email\" required>", "<input id=\"email\" placeholder=\"Email\" required>", "<label>Email</label><input name=\"email\" type=\"text\" autocomplete=\"name\">", "<label for=\"address\">Email</label><input id=\"email\" type=\"email\" required>"], answerIndex: 0, hint: "Use a matching label and id, email type and autocomplete, name, and required.", explanation: "This version correctly labels the email field, chooses the email type, names its submitted value, enables the required check, and uses the matching autocomplete hint." },
    ],
  },
  {
    title: "5. Semantic landmarks",
    explanation: "Semantic landmarks describe the major regions of a page so people can understand and move around it. header usually contains introductory page or section content. nav groups important navigation links. main contains the page's central content. section groups a related topic and usually has a heading. footer contains information about its page or section. These elements provide structure without requiring a particular visual design.",
    syntax: "<header><h1>Community Center</h1></header>\n<nav aria-label=\"Main navigation\">...</nav>\n<main>\n  <section aria-labelledby=\"events-title\">\n    <h2 id=\"events-title\">Events</h2>\n  </section>\n</main>\n<footer>...</footer>",
    syntaxNotes: ["header introduces a page or section.", "nav identifies important navigation; aria-label can distinguish multiple nav regions.", "main identifies the central content of the page.", "section groups a related topic and should normally have a heading.", "footer contains closing or ownership information for its page or section."],
    example: "<header><h1>Riverside Club</h1></header>\n<nav aria-label=\"Main navigation\"><a href=\"#about\">About</a> <a href=\"#join\">Join</a></nav>\n<main>\n  <section id=\"about\"><h2>About the club</h2><p>We meet every week.</p></section>\n  <section id=\"join\"><h2>Join us</h2><p>New members are welcome.</p></section>\n</main>\n<footer><p>Riverside Club</p></footer>",
    expectedOutput: "The page shows a club heading, navigation links, two titled content sections, and a footer. The landmarks give the page meaningful regions even though their exact appearance depends on browser defaults and styles.",
    useCases: ["Landmarks help keyboard and screen-reader users jump to important page regions.", "Sections group related information under a heading.", "A clear page structure helps all readers scan content and understand where a form belongs."],
    commonMistakes: ["Using section as a generic wrapper; choose it for a related topic and give it a heading.", "Putting central content outside main; move the primary page content into main.", "Leaving multiple nav regions unlabeled; add a distinct accessible label to each."],
    practice: ["Outline a small club page with header, nav, main, two headed sections, and footer.", "Give a second navigation region a label that describes its purpose."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Easy", prompt: "Which landmark contains the page's central content?", options: ["main", "footer", "nav", "header"], answerIndex: 0, hint: "It represents the document's primary content.", explanation: "main identifies the dominant content of the page." },
      { kind: "predict-output", difficulty: "Medium", prompt: "How many section headings are in this page structure?", snippet: "<main><section><h2>Hours</h2></section><section><h2>Location</h2></section></main>", options: ["Two", "One", "Three", "None"], answerIndex: 0, hint: "Count the h2 elements inside the sections.", explanation: "There is one h2 in each section, so the structure has two section headings." },
      { kind: "find-and-fix", difficulty: "Medium", prompt: "A content group about opening hours needs a meaningful structure. Which fix is best?", snippet: "<div><h2>Opening hours</h2><p>Weekdays, 9–5</p></div>", options: ["Use section for the related headed content", "Replace h2 with a button", "Put the content inside nav", "Move it into footer even though it is core content"], answerIndex: 0, hint: "A group with one related topic and its own heading can be a section.", explanation: "section is appropriate for a related thematic group with a heading. A div has no semantic meaning." },
      { kind: "code-challenge", difficulty: "Challenging", prompt: "Choose a clear page outline for a site with navigation and main content.", options: ["<header>...</header><nav aria-label=\"Main navigation\">...</nav><main><section><h2>News</h2>...</section></main><footer>...</footer>", "<main><nav>...</nav><footer><section><header>...</header></section></footer></main>", "<section><main><main>...</main></main></section><nav>...</nav>", "<header>...</header><div>All content</div><header>...</header>"], answerIndex: 0, hint: "Use each landmark for its usual region and keep one central main content area.", explanation: "This outline gives navigation, central content, a headed section, and footer distinct semantic regions." },
    ],
  },
  {
    title: "6. Accessible instructions and labels",
    explanation: "People need to know what a field asks for and how to correct a mistake. Keep a visible label for every control. Put short instructions near the relevant field and connect extra help using aria-describedby with matching ids. Mark necessary fields with required and explain that they are required in visible text or a form note. Do not rely on placeholder text alone: it can disappear while someone types and may be hard to see. Use helpful, specific instructions instead of vague directions.",
    syntax: "<label for=\"phone\">Phone number</label>\n<p id=\"phone-help\">Include your area code.</p>\n<input id=\"phone\" name=\"phone\" type=\"tel\" required aria-describedby=\"phone-help\">",
    syntaxNotes: ["label and for/id give the control its persistent accessible name.", "The help paragraph has an id so it can be referenced.", "aria-describedby connects the input to the additional instruction; its value is the referenced id.", "required asks browser validation to check for a value before ordinary submission."],
    example: "<p>Fields marked required must be completed.</p>\n<label for=\"phone\">Phone number (required)</label>\n<p id=\"phone-help\">Include your area code.</p>\n<input id=\"phone\" name=\"phone\" type=\"tel\" required aria-describedby=\"phone-help\">",
    expectedOutput: "A visible required note, a Phone number label, and a short instruction appear with a telephone field. Assistive technology can announce the associated help text when the field is focused.",
    useCases: ["Short instructions explain the expected format before a visitor submits.", "Labels and descriptions support screen readers, speech input, keyboard use, and people who benefit from clear directions.", "Required notes help visitors understand what must be completed before submission."],
    commonMistakes: ["Using placeholder as the only label; add an associated visible label.", "Writing a vague message such as “Invalid”; explain what to enter or how to correct it.", "Pointing aria-describedby at a missing id; make its value match the help text id."],
    practice: ["Add a visible label, a format hint, and aria-describedby to a phone field.", "Write a short form note that explains which fields are required."],
    quiz: [
      { kind: "multiple-choice", difficulty: "Easy", prompt: "What is a placeholder not meant to replace?", options: ["A visible label", "The form action", "The input type", "A submit button"], answerIndex: 0, hint: "It disappears or changes as the visitor enters a value.", explanation: "A placeholder is a temporary example; it should not replace a persistent visible label." },
      { kind: "predict-output", difficulty: "Medium", prompt: "Which help text is associated with this input?", snippet: "<p id=\"zip-help\">Enter five digits.</p><input aria-describedby=\"zip-help\">", options: ["Enter five digits.", "No help text", "The input value", "The button label"], answerIndex: 0, hint: "Match aria-describedby to the element id.", explanation: "The value zip-help references the paragraph with id=\"zip-help\"." },
      { kind: "find-and-fix", difficulty: "Medium", prompt: "What should be fixed so the field has a persistent name?", snippet: "<input type=\"text\" placeholder=\"Your name\">", options: ["Add a visible label associated using for/id", "Make the placeholder longer", "Add required but no label", "Set aria-describedby to the placeholder text"], answerIndex: 0, hint: "Help text may add context, but the control still needs a label.", explanation: "A connected label provides a persistent accessible name. Placeholder alone is not enough." },
      { kind: "code-challenge", difficulty: "Challenging", prompt: "Choose a required field with a visible label and connected format instruction.", options: ["<label for=\"phone\">Phone number (required)</label><p id=\"phone-help\">Include area code.</p><input id=\"phone\" name=\"phone\" type=\"tel\" required aria-describedby=\"phone-help\">", "<input placeholder=\"Phone number required include area code\">", "<label for=\"phone-help\">Phone</label><input id=\"phone\" required aria-describedby=\"missing\">", "<label>Phone</label><input type=\"tel\" name=\"phone\">"], answerIndex: 0, hint: "Check label/id, a real help-text id, required, a suitable type, and name.", explanation: "The label names the field, the help paragraph is connected, required is explicit, tel is suitable, and name identifies the submitted value." },
    ],
  },
];

export const htmlMilestoneThreeAssignments = [
  {
    title: "Student Registration Form",
    problemStatement: "Build a registration form that lets a student enter essential details and understand what is required before submitting.",
    requirements: ["Collect the student's name, email, date of birth, and one appropriate student detail such as grade or class.", "Use matching labels and input ids, suitable input types, and meaningful name values.", "Use required and autocomplete where they help the form work clearly.", "Include concise accessible instructions and a clearly named submit button."],
    expectedBehavior: ["Clicking a label focuses its matching field.", "The browser checks required fields before normal submission.", "The form submits to its stated action using its stated method when valid."],
    criteria: ["Form action and method are appropriate and documented.", "Every control has an associated visible label and suitable type.", "Required, name, and autocomplete values are applied intentionally.", "Instructions and button labels are clear and keyboard operable."],
    hints: ["List the information the school truly needs before choosing controls.", "Use a different id for every input, then match each label's for value.", "Keep optional details optional and explain required fields near the form."],
    submissionChecklist: ["I checked the form in a browser and tested label clicks.", "I tried submitting with a required field empty and reviewed the browser feedback.", "I checked that each field has a unique id and a useful name.", "I reviewed the page using only the keyboard."],
  },
  {
    title: "Contact Us Form",
    problemStatement: "Create a contact form that gathers enough information for a team to understand and answer a visitor's message.",
    requirements: ["Include name, email, subject, and message fields.", "Use a suitable input type for email and a multiline control for the message.", "Use labels, name values, and validation attributes such as required where needed.", "Set a suitable action and method for sending the message."],
    expectedBehavior: ["Visitors can identify each field without relying on placeholder text.", "The browser checks required fields and email format before a normal submission.", "A valid submission is addressed to the configured contact route using the chosen method."],
    criteria: ["All four requested fields are present and labeled.", "Email and message controls suit the data being collected.", "Action, method, name, and required attributes are used correctly.", "Instructions and success/error expectations are clear without promising unsupported behavior."],
    hints: ["The subject is usually a single-line value; the message needs room for multiple lines.", "Use POST for sending a new message; the receiving server route must exist.", "Tell visitors what information to include and which fields are required."],
    submissionChecklist: ["I tested the empty required-field behavior.", "I tested a malformed email value in a browser.", "I checked that the submit button has a clear accessible name.", "I confirmed the action points to the intended contact endpoint."],
  },
  {
    title: "Semantic Webpage Layout",
    problemStatement: "Build a small, understandable page around a form using landmarks that help visitors navigate its regions.",
    requirements: ["Include header, nav, main, at least one headed section, and footer landmarks.", "Place a clearly structured form in the main content.", "Use associated labels, helpful instructions, suitable input types, and a named submit button.", "Keep navigation and form controls operable with a keyboard and understandable to assistive technology."],
    expectedBehavior: ["Visitors can identify the page header, navigation, main content, and footer.", "A keyboard user can reach links and controls in a logical order.", "A screen reader can identify landmarks and the name/instructions for each field."],
    criteria: ["Landmarks are used for their intended regions and section has a heading.", "The form has a clear action and method.", "Labels and instructions are programmatically associated with their controls.", "No placeholder is used as the only label and button purposes are explicit."],
    hints: ["Sketch the page regions before writing the form.", "Put the form in the page's main content and group related fields under headings.", "Use label for/id for each field and associate extra instructions by id."],
    submissionChecklist: ["I tested the page's links and form controls with a keyboard.", "I checked the landmark outline and section headings.", "I verified every form label and instruction points to the right control.", "I reviewed the page at a narrow viewport and checked that labels remain visible."],
  },
];

export const htmlMilestoneThreeInterviewQuestions: [string, string][] = [
  ["What is the purpose of action on a form?", "It names the URL that receives the form data when a visitor submits the form."],
  ["When would you choose GET or POST?", "GET is useful for searches and filters that can be revisited. POST is common when sending new or changed information. The server must support the chosen route and method."],
  ["How do a label and an input become associated?", "Set the label's for value to exactly match the input's unique id."],
  ["Why does a form control need name as well as id?", "id identifies the control in the page and connects its label. name supplies the key for the value in submitted form data."],
  ["What does required do, and what does it not do?", "It asks browser validation to require a value before ordinary submission. It does not replace a label or server-side validation."],
  ["Why should placeholder not be the only field label?", "Placeholder text can disappear when typing and may be difficult to perceive; a visible label remains available."],
  ["What do semantic landmarks help with?", "They identify page regions and help keyboard and assistive-technology users navigate the page."],
];

export type HtmlMilestone = {
  id: string;
  title: string;
  description: string;
  topics: string[];
  syntax: string;
  example: string;
  tasks: { title: string; brief: string; starter: string }[];
  questions: HtmlQuestion[];
  mdn: { title: string; url: string }[];
};

export const htmlCourseId = "html-fundamentals";

export const htmlMilestones: HtmlMilestone[] = [
  {
    id: "html-milestone-1",
    title: "Milestone 1: HTML Fundamentals",
    description: "Build a clear document and format text with common HTML elements.",
    topics: ["Document structure", "Tags, elements, and attributes", "Headings and paragraphs", "Text formatting", "div and span", "Ordered and unordered lists"],
    syntax: "<tag attribute=\"value\">Content</tag>\n<!-- A comment is not displayed -->",
    example: "<!doctype html>\n<html lang=\"en\">\n  <head><meta charset=\"utf-8\"><title>About Me</title></head>\n  <body>\n    <h1>About Sam</h1>\n    <p>I enjoy <strong>building things</strong> and learning HTML.</p>\n    <div><h2>My hobbies</h2><ul><li>Reading</li><li>Cooking</li></ul></div>\n  </body>\n</html>",
    tasks: [
      { title: "About Me page", brief: "Use a page title, one main heading, short paragraphs, formatted text, a section with div/span, and a list of interests.", starter: "<!doctype html>\n<html lang=\"en\">\n<head><meta charset=\"utf-8\"><title>About Me</title></head>\n<body>\n  <!-- Add your page content -->\n</body>\n</html>" },
      { title: "Restaurant Menu", brief: "Organize a restaurant name, menu sections, item names, descriptions, and prices with headings, paragraphs, and lists.", starter: "<h1>Little Garden</h1>\n<h2>Lunch</h2>\n<ul>\n  <li><strong>Tomato soup</strong> — $5</li>\n</ul>" },
      { title: "Wikipedia-style article", brief: "Write a factual article with a title, introduction, section headings, paragraphs, and a numbered contents list.", starter: "<article>\n  <h1>Example topic</h1>\n  <p>Write a short introduction.</p>\n  <h2>History</h2>\n  <p>Add a factual paragraph.</p>\n</article>" },
    ],
    questions: [
      { question: "What is the difference between a tag and an element?", answer: "A tag is markup such as <p> or </p>. An element includes its tags and the content between them." },
      { question: "When should you use div and span?", answer: "Use div as a generic block container and span as a generic inline container when no semantic element fits." },
      { question: "How do ol and ul differ?", answer: "ol presents an ordered sequence; ul presents an unordered list. Both contain li items." },
    ],
    mdn: [{ title: "Getting started with HTML", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax" }, { title: "HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" }],
  },
  {
    id: "html-milestone-2", title: "Milestone 2: Links, Images, Tables & Multimedia", description: "Connect pages and present visual and tabular information responsibly.",
    topics: ["Links and href", "Images and alt text", "Relative file paths", "Tables with headers", "Audio, video, and embeds"],
    syntax: "<a href=\"about.html\">About</a>\n<img src=\"images/photo.jpg\" alt=\"A red kite in the sky\">\n<table><tr><th scope=\"col\">Name</th><td>Ada</td></tr></table>",
    example: "<figure>\n  <img src=\"images/coast.jpg\" alt=\"Rocky coast at sunset\">\n  <figcaption>Sunset on the coast</figcaption>\n</figure>\n<table>\n  <caption>Weekly reading</caption>\n  <tr><th scope=\"col\">Day</th><th scope=\"col\">Pages</th></tr>\n  <tr><td>Monday</td><td>12</td></tr>\n</table>",
    tasks: [
      { title: "Image Gallery", brief: "Create a gallery with at least four images, meaningful alt text, captions, and working relative image paths.", starter: "<main>\n  <h1>My Gallery</h1>\n  <figure><img src=\"images/photo-1.jpg\" alt=\"Describe the image\"><figcaption>Caption</figcaption></figure>\n</main>" },
      { title: "Student Report Card", brief: "Use a caption, column headers with scope, student subjects, marks, and a final summary row.", starter: "<table>\n  <caption>Term report</caption>\n  <thead><tr><th scope=\"col\">Subject</th><th scope=\"col\">Mark</th></tr></thead>\n  <tbody><tr><th scope=\"row\">Science</th><td>88</td></tr></tbody>\n</table>" },
      { title: "Travel Blog", brief: "Write a destination post with descriptive images, links to useful places, and an embedded video or map with an accessible title.", starter: "<article>\n  <h1>A weekend in Jaipur</h1>\n  <p><a href=\"https://example.com\">Plan a visit</a></p>\n  <iframe title=\"Map of Jaipur\" src=\"https://www.openstreetmap.org/export/embed.html\"></iframe>\n</article>" },
    ],
    questions: [
      { question: "Why does an informative image need alt text?", answer: "Alt text communicates the image's meaning to people using assistive technology and appears when the image cannot load. Decorative images can use alt=\"\"." },
      { question: "What is a relative file path?", answer: "A path resolved from the current document, such as images/photo.jpg or ../index.html." },
      { question: "Which elements identify table headers?", answer: "Use th for header cells and scope=\"col\" or scope=\"row\" to associate them with data." },
    ],
    mdn: [{ title: "Creating hyperlinks", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Creating_links" }, { title: "Images in HTML", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img" }, { title: "HTML tables", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics" }],
  },
  {
    id: "html-milestone-3", title: "Milestone 3: HTML Forms, Semantics & Accessibility", description: "Build useful forms and understandable pages with accessible structure.",
    topics: ["Forms and action/method", "Inputs and labels", "Buttons and input types", "name, required, and autocomplete", "Semantic landmarks", "Accessible instructions and labels"],
    syntax: "<form action=\"/apply\" method=\"post\">\n  <label for=\"email\">Email</label>\n  <input id=\"email\" name=\"email\" type=\"email\" required>\n  <button type=\"submit\">Send</button>\n</form>",
    example: "<header><h1>Community Club</h1></header>\n<nav aria-label=\"Main navigation\"><a href=\"#events\">Events</a></nav>\n<main><article><h2 id=\"events\">Upcoming events</h2><p>Join us Saturday.</p></article></main>\n<footer><p>Contact the club</p></footer>",
    tasks: [
      { title: "Student Registration Form", brief: "Collect name, email, password, date of birth, and agreement using labels, suitable input types, required fields, and a submit button.", starter: "<form action=\"#\" method=\"post\">\n  <label for=\"full-name\">Full name</label>\n  <input id=\"full-name\" name=\"fullName\" autocomplete=\"name\" required>\n  <button type=\"submit\">Register</button>\n</form>" },
      { title: "Contact Us Form", brief: "Collect a visitor's name, email, subject, and message using suitable labels, input types, validation attributes, action, and method.", starter: "<form action=\"/contact\" method=\"post\">\n  <!-- Build and label each contact field -->\n</form>" },
      { title: "Semantic Webpage Layout", brief: "Build a page with header, nav, main, a headed section, footer, and an accessible form.", starter: "<header><!-- Page introduction --></header>\n<nav><!-- Site links --></nav>\n<main><!-- Add a headed section and form --></main>\n<footer><!-- Closing information --></footer>" },
    ],
    questions: [
      { question: "Why should every form control have a label?", answer: "A label gives the control a programmatic name, helps screen-reader users, and enlarges its clickable target." },
      { question: "What does the name attribute do?", answer: "It supplies the field name used when the browser submits the form data." },
      { question: "Name three useful semantic landmarks.", answer: "header, nav, main, and footer are common landmarks; article and section describe related content." },
    ],
    mdn: [{ title: "Your first form", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Your_first_form" }, { title: "HTML forms guide", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms" }, { title: "Semantic HTML", url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html" }],
  },
  {
    id: "html-milestone-4", title: "Milestone 4: Layout & Final Project", description: "Read a page's structure, organize files, and bring the fundamentals together.",
    topics: ["Semantic page layout", "Reading existing HTML", "Indentation and nesting", "Organizing files and assets", "Complete portfolio structure"],
    syntax: "<header>...</header>\n<nav>...</nav>\n<main>\n  <section>...</section>\n  <article>...</article>\n</main>\n<footer>...</footer>",
    example: "portfolio/\n├── index.html\n├── pages/\n│   └── projects.html\n└── images/\n    └── profile.jpg\n\n<!-- Keep one main landmark and nest related content clearly. -->",
    tasks: [
      { title: "Recreate a reference structure", brief: "Given a reference screenshot or wireframe, identify its header, navigation, main sections, article/cards, and footer, then reproduce that structure in semantic HTML.", starter: "<header><!-- site title --></header>\n<nav><!-- navigation links --></nav>\n<main><!-- content sections --></main>\n<footer><!-- contact/copyright --></footer>" },
      { title: "Analyze existing HTML", brief: "Read a provided HTML file, label its title, metadata, landmarks, headings, links, images, and form controls, then explain the nesting in your own words.", starter: "<!-- Inspect each opening tag, its children, and matching closing tag. -->\n<main><article><h1>Sample page</h1><p>Read this structure.</p></article></main>" },
      { title: "Personal Portfolio Website (final project)", brief: "Build a complete HTML-only portfolio with home/about, skills list, project descriptions and links, an accessible contact form, semantic landmarks, and organized image assets. HTML structures the page; visual styling is intentionally out of scope.", starter: "<!doctype html>\n<html lang=\"en\">\n<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Your Name — Portfolio</title></head>\n<body>\n  <header><h1>Your Name</h1><nav><a href=\"#about\">About</a> <a href=\"#projects\">Projects</a></nav></header>\n  <main><section id=\"about\"><h2>About me</h2></section><section id=\"projects\"><h2>Projects</h2></section></main>\n  <footer><p>Contact: <a href=\"mailto:hello@example.com\">Email me</a></p></footer>\n</body>\n</html>" },
    ],
    questions: [
      { question: "What belongs inside main?", answer: "The document's dominant, unique content. Usually a page has one visible main element." },
      { question: "How is section different from article?", answer: "section groups a themed part of a page, usually with a heading; article is a self-contained composition that could stand on its own." },
      { question: "Why organize images in a folder?", answer: "A predictable asset folder makes relative paths easier to understand and the project easier to maintain." },
    ],
    mdn: [{ title: "Structuring a page of content", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_a_page_of_content" }, { title: "HTML elements reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element" }],
  },
];
