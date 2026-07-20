const fs = require('fs');

const intro = 'Lyon’s Artisans nació de una creencia simple: el verdadero lujo se crea a través de la artesanía, la intención y la autenticidad. Durante décadas nuestro equipo ha refinado un enfoque que une la zapatería tradicional con el desarrollo moderno y los estándares globales de producción.';

const paragraphs = intro.split('.').filter(Boolean).map(s => s.trim() + '.');
console.log("Paragraphs:", paragraphs);

const p1Words = paragraphs[0]?.split(' ') || [];
console.log("p1Words:", p1Words);
console.log("p1Words.length:", p1Words.length);

const p2Words = paragraphs[1]?.split(' ') || [];
console.log("p2Words:", p2Words);
console.log("p2Words.length:", p2Words.length);

