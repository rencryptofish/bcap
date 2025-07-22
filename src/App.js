import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';
import readmeContent from '!!raw-loader!../README.md';

function App() {
  return (
    <div className="App">
      <div className="markdown-container">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({node, ...props}) => {
              if (props.src && props.src.startsWith('img/')) {
                try {
                  const imageName = props.src.split('/').pop();
                  const imageModule = require(`../img/${imageName}`);
                  return <img {...props} src={imageModule} alt={props.alt || ''} />;
                } catch (e) {
                  console.error('Failed to load image:', props.src);
                  return <img {...props} alt={props.alt || ''} />;
                }
              }
              return <img {...props} alt={props.alt || ''} />;
            },
            a: ({node, ...props}) => {
              if (props.href && props.href.startsWith('#')) {
                return <a {...props} />;
              }
              if (props.href && !props.href.startsWith('http')) {
                try {
                  if (props.href.endsWith('.pdf')) {
                    const pdfName = props.href.split('/').pop();
                    const pdfModule = pdfName.includes('/') 
                      ? require(`../${props.href}`)
                      : require(`../${pdfName}`);
                    return <a {...props} href={pdfModule} target="_blank" rel="noopener noreferrer" />;
                  }
                } catch (e) {
                  console.error('Failed to load file:', props.href);
                }
              }
              return <a {...props} target="_blank" rel="noopener noreferrer" />;
            }
          }}
        >
          {readmeContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default App;