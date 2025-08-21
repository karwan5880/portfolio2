'use client'

export const SyntaxHighlightedCode = ({ content }) => {
  if (typeof content !== 'string') return null
  const html = content
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/(const|let|class|return|def|fn|public|static|void)/g, '<span class="keyword">$1</span>')
    .replace(/("[^"]*")/g, '<span class="string">$1</span>')
    .replace(/(\/\/.*|\#.*|\/\*.*\*\/)/g, '<span class="comment">$1</span>')
  return <pre dangerouslySetInnerHTML={{ __html: html }} />
}

// export const SyntaxHighlightedCode = ({ content }) => {
//   if (typeof content !== 'string') return null
//   const html = content
//     .replace(/</g, '<')
//     .replace(/>/g, '>')
//     .replace(/(const|let|class|return|def|fn|public|static|void)/g, '<span class="keyword">$1</span>')
//     .replace(/("[^"]*")/g, '<span class="string">$1</span>')
//     .replace(/(\/\/.*|\#.*|\/\*.*\*\/)/g, '<span class="comment">$1</span>')
//   return <pre dangerouslySetInnerHTML={{ __html: html }} />
// }
