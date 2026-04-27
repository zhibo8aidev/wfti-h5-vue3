import { PERSONAS } from '@/domains/questionBank';
import type { PersonalityResult } from '@/domains/types';

const POSTER_WIDTH = 750;
const POSTER_HEIGHT = 1334;

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 5): void {
  const chars = Array.from(text);
  let line = '';
  let lineCount = 0;
  chars.forEach((char, index) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = char;
      lineCount += 1;
    } else {
      line = testLine;
    }
    if (index === chars.length - 1 && lineCount < maxLines) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
    }
  });
}

function drawQrPlaceholder(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, seed: string): void {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = '#111827';
  const cell = size / 9;
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const codePoint = seed.charCodeAt((row * 9 + col) % seed.length);
      if ((codePoint + row + col) % 3 === 0 || row < 2 || col < 2) {
        ctx.fillRect(x + col * cell + 2, y + row * cell + 2, cell - 4, cell - 4);
      }
    }
  }
}

export function generatePosterPng(result: PersonalityResult): string {
  const canvas = document.createElement('canvas');
  canvas.width = POSTER_WIDTH;
  canvas.height = POSTER_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is not available');
  }

  const persona = PERSONAS[result.personality_code];
  const gradient = ctx.createLinearGradient(0, 0, 0, POSTER_HEIGHT);
  gradient.addColorStop(0, '#EFF7FF');
  gradient.addColorStop(0.48, '#FFFFFF');
  gradient.addColorStop(1, '#EAF5FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);

  ctx.fillStyle = persona.color;
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(610, 150, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#1A1A1A';
  ctx.font = '700 34px sans-serif';
  ctx.fillText('WFTI 世界杯球迷人格大鉴赏', 56, 90);

  ctx.fillStyle = persona.color;
  ctx.font = '900 118px sans-serif';
  ctx.fillText(result.personality_code, 56, 240);
  ctx.fillStyle = '#111827';
  ctx.font = '800 52px sans-serif';
  ctx.fillText(result.personality_name, 62, 312);

  drawRoundRect(ctx, 56, 372, 638, 328, 28);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = persona.color;
  ctx.globalAlpha = 0.08;
  ctx.fillRect(56, 372, 638, 328);
  ctx.globalAlpha = 1;

  ctx.fillStyle = persona.color;
  ctx.font = '800 28px sans-serif';
  result.tags.forEach((tag, index) => {
    const x = 94 + (index % 2) * 245;
    const y = 430 + Math.floor(index / 2) * 68;
    ctx.fillText(`#${tag}`, x, y);
  });

  ctx.fillStyle = '#0082FF';
  ctx.font = '900 108px sans-serif';
  ctx.fillText('26', 304, 596);
  ctx.fillStyle = '#111827';
  ctx.font = '700 28px sans-serif';
  ctx.fillText('你的球迷 DNA 已完成扫描', 176, 650);

  drawRoundRect(ctx, 56, 744, 638, 256, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#1A1A1A';
  ctx.font = '600 30px sans-serif';
  ctx.fillText('人格解析', 94, 804);
  ctx.fillStyle = '#4B5563';
  ctx.font = '400 28px sans-serif';
  wrapText(ctx, result.personality_copy, 94, 858, 560, 42, 4);

  ctx.fillStyle = '#111827';
  ctx.font = '700 28px sans-serif';
  ctx.fillText(`球星对照：${result.star}`, 94, 1062);
  ctx.fillText(`最佳拍档：${PERSONAS[result.partner].name}`, 94, 1110);
  ctx.fillText(`天敌人格：${PERSONAS[result.enemy].name}`, 94, 1158);

  const target = `https://github.com/zhibo8aidev/wfti-h5-vue3?source=poster&personality=${result.personality_code}`;
  drawQrPlaceholder(ctx, 532, 1050, 128, target);
  ctx.fillStyle = '#667085';
  ctx.font = '400 22px sans-serif';
  ctx.fillText('扫码测试你的球迷人格', 420, 1212);
  ctx.fillStyle = '#0082FF';
  ctx.font = '800 28px sans-serif';
  ctx.fillText('Zhibo8', 56, 1260);

  return canvas.toDataURL('image/png');
}
