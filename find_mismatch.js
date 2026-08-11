const fs = require('fs');
const lines = fs.readFileSync('motion_tags.txt', 'utf8').split('\n').filter(Boolean);
let stack = [];
for (let line of lines) {
  const [num, tag] = line.split(':');
  if (tag === '<motion.div') {
    stack.push(num);
  } else if (tag === '</motion.div>') {
    if (stack.length > 0) stack.pop();
    else console.log('Extra closing tag at', num);
  }
}
console.log('Unclosed opening tags at:', stack);
