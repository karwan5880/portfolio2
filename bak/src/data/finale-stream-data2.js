// data/finale-stream-data.js

const createCodeBlock = (title, code) => ({ type: 'multi-column', columns: [{ title, code }] })

export const finaleStream = {
  main_theme: [
    { type: 'thought', content: 'The journey is the reward.' },
    { type: 'thought', content: 'For every "no", a new line of code.' },
    { type: 'thought', content: 'Failure is not an exception. It is a core library.' },
    { type: 'thought', content: 'There is a profound beauty in a system that works.' },
    { type: 'thought', content: 'Solve the problem, then write the code.' },
    { type: 'thought', content: 'The journey is the reward.' },
    { type: 'thought', content: 'For every "no", a new line of code.' },
    { type: 'comment-c', content: '/* Here be dragons. */' },
    { type: 'comment-js', content: '// Perfection is a direction, not a destination.' },
    { type: 'comment-py', content: '# The cost of knowledge is effort; the reward is creation.' },
    { type: 'comment-c', content: '/* Every bug is a lesson in disguise. */' },
    { type: 'comment-asm', content: '; The shortest path is rarely the most scenic.' },
    { type: 'comment-asm', content: '; The shortest path is rarely the most scenic.' },
    { type: 'comment-sh', content: '# First, do it. Then, do it right. Then, do it better.' },
    { type: 'comment-js', content: '// TODO: Figure out the meaning of it all.' },
    { type: 'code-line', content: 'make && ./run_simulation' },
    { type: 'code-line', content: '$ echo "Hello, World"' },
    { type: 'code-line', content: '>>> print("Still building...")' },
    { type: 'code-line', content: 'grep -r "the_bug" .' },
    { type: 'code-line', content: 'git push origin main --force' },
    { type: 'code-line', content: '$ echo "Hello, World"' },
    { type: 'code-line', content: '>>> print("Still building...")' },
    { type: 'code-line', content: 'git commit -m "Refactor entire universe"' },
    { type: 'code-line', content: 'sudo apt-get update && sudo apt-get upgrade -y' },
    { type: 'code-line', content: 'make && ./run_simulation' },
    { type: 'code-line', content: 'const a = 42;' },
    { type: 'code-line', content: 'grep -r "the_bug" .' },
    { type: 'code-line', content: 'git push origin main --force' },
    { type: 'code-line', content: 'while(true) { suffer(); }' },
    createCodeBlock('X86 ASSEMBLY', `SECTION .text\n  global _start\n\n_start:\n  mov edx, len...`),
    createCodeBlock('RUST OWNERSHIP', `fn main() {\n  let s1 = String::from("hello");...`),
    createCodeBlock(
      'WINRT C++/WINRT',
      `// WINRT\n#include <winrt/Windows.Foundation.h>\n\nusing namespace winrt;\nusing namespace Windows::Foundation;\n\nIAsyncAction main() {\n  // CoInitialize / Uninitialize RAII\n  apartment_context-apartment;\n  // ...\n}`
    ),
    createCodeBlock('SQL JOIN', `SELECT \n  u.id, u.name, p.post_title\nFROM users u\nJOIN posts p ON u.id = p.user_id\nWHERE u.signup_date > '2023-01-01';`),
    createCodeBlock('X86 ASSEMBLY', `SECTION .text\n  global _start\n\n_start:\n  mov edx, len\n  mov ecx, msg\n  mov ebx, 1\n  mov eax, 4\n  int 0x80`),
    createCodeBlock(
      'RUST OWNERSHIP',
      `fn main() {\n  let s1 = String::from("hello");\n  let s2 = s1; // s1 is moved to s2\n\n  // println!("{}, world!", s1); // This would fail!\n  println!("{}, world!", s2);\n}`
    ),
    createCodeBlock(
      'DOCKERFILE',
      `FROM python:3.9-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY . .\n\nCMD ["python", "main.py"]`
    ),
    createCodeBlock(
      'JAVASCRIPT FETCH API',
      `async function getData(url) {\n  const response = await fetch(url);\n  if (!response.ok) {\n    throw new Error('Network response was not ok.');\n  }\n  return response.json();\n}`
    ),
    createCodeBlock(
      'PORTFOLIO_NODE.JS (Self-Reference!)',
      `function ArtifactNode({ type, isActive }) {\n  // ...\n  return (\n    <group>\n      {type === 'cube' && <GenesisCube isActive={isActive} />}\n      {type === 'crystal' && <DataCrystal isActive={isActive} />}\n      {/* ... and so on ... */}\n    </group>\n  )\n}`
    ),
    // ... more classic, powerful code
  ],
  // Theme for your "Winter" Song - Calm, poetic, elegant code
  snow: [
    { type: 'thought', content: 'Simplicity is the ultimate sophistication.' },
    { type: 'thought', content: 'Sleep. Wake up. Code. Eat. Repeat. ' },
    { type: 'thought', content: 'The journey is the reward.' },
    { type: 'thought', content: 'The journey is the reward.' },
    { type: 'thought', content: 'The best way to predict the future is to build it.' },
    { type: 'thought', content: 'An investment in knowledge pays the best interest.' },
    { type: 'thought', content: 'Code is poetry.' },
    { type: 'thought', content: 'Every master was once a disaster.' },
    { type: 'thought', content: 'Failure is not an exception. It is a core library.' },
    { type: 'thought', content: 'There is a profound beauty in a system that works.' },
    { type: 'thought', content: 'Solve the problem, then write the code.' },
    { type: 'comment-py', content: '# Code is poetry.' },
    { type: 'comment-sh', content: '# First, do it. Then, do it right. Then, do it better.' },
    { type: 'comment-js', content: '// Perfection is a direction, not a destination.' },
    { type: 'comment-py', content: '# The cost of knowledge is effort; the reward is creation.' },
    { type: 'comment-c', content: '/* Every bug is a lesson in disguise. */' },
    { type: 'comment-py', content: '# This part is magic. Do not touch.' },
    { type: 'comment-c', content: '/* Here be dragons. */' },
    { type: 'comment-js', content: '// Perfection is a direction, not a destination.' },
    { type: 'comment-py', content: '# The cost of knowledge is effort; the reward is creation.' },
    { type: 'code-line', content: 'export const getAnswer = () => 42;' },
    { type: 'code-line', content: '1. e4 e5 2. Nf3 Nc6 3. Bb5' },
    { type: 'code-line', content: 'public static void main(String[] args)' },
    { type: 'code-line', content: 'Exception e = new Exception("Something bad happened");' },
    { type: 'code-line', content: 'console.log(`The time is ${new Date()}`)' },
    { type: 'code-line', content: '[...new Set(array)]' },
    { type: 'code-line', content: 'process.exit(1);' },
    createCodeBlock('PYTHON DECORATOR', `def my_decorator(func):\n  def wrapper(*args, **kwargs):...`),
    createCodeBlock('CSS ANIMATION', `@keyframes scrollUp {\n  from { transform: translateY(0); }\n  to { transform: translateY(-3000vh); }\n}`),
    createCodeBlock('C++ TEMPLATE', `template<typename T>\nclass Node {\npublic:\n  T data;\n  Node* next;\n\n  Node(T val) : data(val), next(nullptr) {}\n};`),
    createCodeBlock('JAVA OOP', `public class Main {\n  public static void main(String[] args) {\n    System.out.println("The machine is always running.");\n  }\n}`),
    createCodeBlock('PYTHON NUMPY', `import numpy as np\n\ndef process_data(arr):\n  mean = np.mean(arr)\n  std_dev = np.std(arr)\n  return (arr - mean) / std_dev`),
    createCodeBlock(
      'REACT HOOK',
      `const useViewport = () => {\n  const [width, setWidth] = useState(window.innerWidth);\n\n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n\n  return { width };\n}`
    ),
    createCodeBlock(
      'WINRT C++/WINRT',
      `// WINRT\n#include <winrt/Windows.Foundation.h>\n\nusing namespace winrt;\nusing namespace Windows::Foundation;\n\nIAsyncAction main() {\n  // CoInitialize / Uninitialize RAII\n  apartment_context-apartment;\n  // ...\n}`
    ),
    createCodeBlock('SQL JOIN', `SELECT \n  u.id, u.name, p.post_title\nFROM users u\nJOIN posts p ON u.id = p.user_id\nWHERE u.signup_date > '2023-01-01';`),
    createCodeBlock('X86 ASSEMBLY', `SECTION .text\n  global _start\n\n_start:\n  mov edx, len\n  mov ecx, msg\n  mov ebx, 1\n  mov eax, 4\n  int 0x80`),
    createCodeBlock(
      'RUST OWNERSHIP',
      `fn main() {\n  let s1 = String::from("hello");\n  let s2 = s1; // s1 is moved to s2\n\n  // println!("{}, world!", s1); // This would fail!\n  println!("{}, world!", s2);\n}`
    ),
    createCodeBlock(
      'DOCKERFILE',
      `FROM python:3.9-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY . .\n\nCMD ["python", "main.py"]`
    ),
    // ... more elegant, simple snippets
  ],
  // Theme for your "Energy" Song - Complex, chaotic, powerful code
  thunder: [
    { type: 'thought', content: 'Failure is not an exception. It is a core library.' },
    { type: 'thought', content: 'Simplicity is the ultimate sophistication.' },
    { type: 'thought', content: 'Good code is its own best documentation.' },
    { type: 'thought', content: 'The screen is a canvas.' },
    { type: 'thought', content: 'The obstacle is the path.' },
    { type: 'thought', content: 'For every "no", a new line of code.' },
    { type: 'thought', content: 'Failure is not an exception. It is a core library.' },
    { type: 'thought', content: 'There is a profound beauty in a system that works.' },
    { type: 'thought', content: 'Solve the problem, then write the code.' },
    { type: 'thought', content: 'Simplicity is the ultimate sophistication.' },
    { type: 'thought', content: 'Good code is its own best documentation.' },
    { type: 'comment-js', content: '// This part is magic. Do not touch.' },
    { type: 'comment-c', content: '/* Here be dragons. */' },
    { type: 'comment-js', content: '// Sometimes I believe the compiler ignores all my comments.' },
    {
      type: 'comment-py',
      content: '# When I wrote this, only God and I understood what I was doing. Now, only God knows.',
    },
    { type: 'comment-c', content: '/* I am not responsible for this code. I am merely its caretaker. */' },
    {
      type: 'comment-asm',
      content: '; I dedicate all this code to my wife, Neit Irlem Eey, who will have to support me and our three children and the dog once it gets released into the public.',
      secret: true,
    },
    {
      type: 'comment-sh',
      content: "# This script, when run, will solve all of life's problems. If not, please submit a bug report.",
    },
    { type: 'comment-js', content: "// I'm sorry." },
    { type: 'comment-py', content: "# If you're reading this, you are stuck in the same loop I was." },
    { type: 'comment-c', content: '/* You are not expected to understand this. */' },
    { type: 'comment-asm', content: '; This is where the fun begins.' },
    { type: 'comment-sh', content: '# To be or not to be, that is the question. This script answers "to be".' },
    { type: 'comment-js', content: '// Fallthrough intended.' },
    { type: 'comment-py', content: '# It works on my machine.' },
    { type: 'code-line', content: 'git push origin main --force' },
    { type: 'code-line', content: 'git commit -m "Refactor entire universe"' },
    { type: 'code-line', content: 'sudo apt-get update && sudo apt-get upgrade -y' },
    { type: 'code-line', content: 'make && ./run_simulation' },
    { type: 'code-line', content: '$ echo "Hello, World"' },
    { type: 'code-line', content: '>>> print("Still building...")' },
    { type: 'code-line', content: 'git commit -m "Refactor entire universe"' },
    { type: 'code-line', content: 'sudo apt-get update && sudo apt-get upgrade -y' },
    { type: 'code-line', content: 'make && ./run_simulation' },
    { type: 'code-line', content: 'const a = 42;' },
    createCodeBlock('RUST OWNERSHIP', `fn main() {\n  let s1 = String::from("hello");...`),
    createCodeBlock(
      'JAVASCRIPT FETCH API',
      `async function getData(url) {\n  const response = await fetch(url);\n  if (!response.ok) {\n    throw new Error('Network response was not ok.');\n  }\n  return response.json();\n}`
    ),
    createCodeBlock(
      'PORTFOLIO_NODE.JS (Self-Reference!)',
      `function ArtifactNode({ type, isActive }) {\n  // ...\n  return (\n    <group>\n      {type === 'cube' && <GenesisCube isActive={isActive} />}\n      {type === 'crystal' && <DataCrystal isActive={isActive} />}\n      {/* ... and so on ... */}\n    </group>\n  )\n}`
    ),
    createCodeBlock('CSS ANIMATION', `@keyframes scrollUp {\n  from { transform: translateY(0); }\n  to { transform: translateY(-3000vh); }\n}`),
    createCodeBlock('JAVA OOP', `public class Main {\n  public static void main(String[] args) {\n    System.out.println("The machine is always running.");\n  }\n}`),
    createCodeBlock(
      'PYTHON DECORATOR',
      `def my_decorator(func):\n def wrapper(*args, **kwargs):\n print("Something is happening before the function is called.")\n    func(*args, **kwargs)\n    print("Something is happening after the function is called.")\n  return wrapper`
    ),
    createCodeBlock('C# LINQ', `var highScores = scores.Where(score => score > 80)\n.OrderByDescending(score => score)\n.Select(score => $"High Score: {score}");`),
    // ... more complex, modern snippets
  ],
  lightning: [
    { type: 'thought', content: 'The screen is a canvas.' },
    { type: 'thought', content: 'Doubt kills more dreams than failure ever will.' },
    { type: 'thought', content: 'Create the things you wish existed.' },
    { type: 'thought', content: 'It’s not a bug, it’s an undocumented feature.' },
    { type: 'thought', content: 'Talk is cheap. Show me the code.' },
    { type: 'thought', content: 'There are two ways to write error-free programs; only the third one works.' },
    {
      type: 'thought',
      content: 'Measuring programming progress by lines of code is like measuring aircraft building progress by weight.',
    },
    {
      type: 'thought',
      content: 'The most important property of a program is whether it accomplishes the intention of its user.',
    },
    { type: 'thought', content: 'Good code is its own best documentation.' },
    { type: 'comment-js', content: '// This part is magic. Do not touch.' },
    { type: 'comment-c', content: '/* Every bug is a lesson in disguise. */' },
    { type: 'comment-asm', content: '; The shortest path is rarely the most scenic.' },
    { type: 'comment-sh', content: '# First, do it. Then, do it right. Then, do it better.' },
    { type: 'comment-js', content: '// TODO: Figure out the meaning of it all.' },
    { type: 'comment-py', content: '# This part is magic. Do not touch.' },
    { type: 'code-line', content: 'const a = 42;' },
    { type: 'code-line', content: 'rm -rf / --no-preserve-root' },
    { type: 'code-line', content: 'npm install' },
    { type: 'code-line', content: 'cargo run' },
    { type: 'code-line', content: 'SELECT * FROM users WHERE clueless > 0;' },
    { type: 'code-line', content: 'git push origin main --force' },
    createCodeBlock('GO CONCURRENCY', `func main() {\n  messages := make(chan string)\n\n  go func() { messages <- "ping" }()\n\n  msg := <-messages\n  fmt.Println(msg)\n}`),
    createCodeBlock(
      'HTML5 STRUCTURE',
      `<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <header>\n    <h1>Welcome</h1>\n  </header>\n  <main>\n    <p>Content goes here.</p>\n  </main>\n  <footer>\n    <p>© 2025</p>\n  </footer>\n</body>\n</html>`
    ),
    createCodeBlock(
      'TAILWINDCSS',
      `<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">\n  <div class="flex-shrink-0">\n    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">\n  </div>\n  <div>\n    <div class="text-xl font-medium text-black">ChitChat</div>\n    <p class="text-gray-500">You have a new message!</p>\n  </div>\n</div>`
    ),
    createCodeBlock(
      'VUE.JS COMPONENT',
      `<template>\n  <div class="hello">\n    <h1>{{ msg }}</h1>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'HelloWorld',\n  props: {\n    msg: String\n  }\n}\n</script>`
    ),
  ],
  // A default theme for any other songs
  default_theme: [
    { type: 'thought', content: 'Still building.' },
    { type: 'comment-sh', content: '# To be or not to be...' },
  ],
}
