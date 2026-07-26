import React from 'react';
import { PieceSymbol, Color } from 'chess.js';
import { PieceStyle } from '../../types/chess';

interface PieceProps {
  piece: PieceSymbol;
  color: Color;
  style?: PieceStyle;
  className?: string;
}

export const PieceSvg: React.FC<PieceProps> = ({ piece, color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';

  // Standard Staunton / Cburnett Vector SVGs (Exact match for standard chess sets)
  const renderSvg = () => {
    switch (piece) {
      case 'p':
        return isWhite ? (
          <path
            d="M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 12.5,29.83 12.5,33 C 12.5,33.5 12.5,34 12.5,34 L 32.5,34 C 32.5,34 32.5,33.5 32.5,33 C 32.5,29.83 30.09,27.09 27.09,26.03 C 28.56,24.84 29.5,23.03 29.5,21 C 29.5,18.59 28.17,16.5 26.22,15.38 C 26.71,14.71 27,13.89 27,13 C 27,10.79 25.21,9 23,9 L 22,9 z M 12,36 L 33,36 M 11,39 L 34,39"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M 22,9 C 19.79,9 18,10.79 18,13 C 18,13.89 18.29,14.71 18.78,15.38 C 16.83,16.5 15.5,18.59 15.5,21 C 15.5,23.03 16.44,24.84 17.91,26.03 C 14.91,27.09 12.5,29.83 12.5,33 C 12.5,33.5 12.5,34 12.5,34 L 32.5,34 C 32.5,34 32.5,33.5 32.5,33 C 32.5,29.83 30.09,27.09 27.09,26.03 C 28.56,24.84 29.5,23.03 29.5,21 C 29.5,18.59 28.17,16.5 26.22,15.38 C 26.71,14.71 27,13.89 27,13 C 27,10.79 25.21,9 23,9 L 22,9 z M 12,36 L 33,36 M 11,39 L 34,39"
            fill="#000000"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case 'n':
        return isWhite ? (
          <g fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
              fill="#ffffff"
            />
            <path
              d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,18 22,10 22,10 C 22,10 27.39,11.39 27.5,15.5 C 27.5,19 23,22 23,22"
              fill="#ffffff"
            />
            <path d="M 9.5,25.5 A 0.5,0.5 0 1,1 8.5,25.5 A 0.5,0.5 0 1,1 9.5,25.5 Z" fill="#000000" stroke="#000000" />
            <path d="M 15,15.5 A 0.5,1.5 0 1,1 14,15.5 A 0.5,1.5 0 1,1 15,15.5 Z" fill="#000000" stroke="#000000" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" />
          </g>
        ) : (
          <g fill="none" fillRule="evenodd" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
              fill="#000000"
            />
            <path
              d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,18 22,10 22,10 C 22,10 27.39,11.39 27.5,15.5 C 27.5,19 23,22 23,22"
              fill="#000000"
            />
            <path d="M 9.5,25.5 A 0.5,0.5 0 1,1 8.5,25.5 A 0.5,0.5 0 1,1 9.5,25.5 Z" fill="#ffffff" stroke="#ffffff" />
            <path d="M 15,15.5 A 0.5,1.5 0 1,1 14,15.5 A 0.5,1.5 0 1,1 15,15.5 Z" fill="#ffffff" stroke="#ffffff" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" />
          </g>
        );

      case 'b':
        return isWhite ? (
          <g fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <g fill="#ffffff" strokeLinejoin="miter">
              <path d="M 9,36 C 12.39,35.03 19.11,36.46 22.5,34 C 25.89,36.46 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.54 9,36 9,36 z" />
              <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,30 27.5,26 27.5,21 C 27.5,16 22.5,10 22.5,10 C 22.5,10 17.5,16 17.5,21 C 17.5,26 15,30 15,30 C 15,30 14.5,30.5 15,32 z" />
              <path d="M 25,8 A 2.5,2.5 0 1,1 20,8 A 2.5,2.5 0 1,1 25,8 Z" />
            </g>
            <path d="M 17.5,26 L 27.5,26" />
            <path d="M 22.5,15 L 22.5,22" />
            <path d="M 19.5,18 L 25.5,18" />
          </g>
        ) : (
          <g fill="none" fillRule="evenodd" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <g fill="#000000" strokeLinejoin="miter">
              <path d="M 9,36 C 12.39,35.03 19.11,36.46 22.5,34 C 25.89,36.46 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.54 9,36 9,36 z" />
              <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,30 27.5,26 27.5,21 C 27.5,16 22.5,10 22.5,10 C 22.5,10 17.5,16 17.5,21 C 17.5,26 15,30 15,30 C 15,30 14.5,30.5 15,32 z" />
              <path d="M 25,8 A 2.5,2.5 0 1,1 20,8 A 2.5,2.5 0 1,1 25,8 Z" />
            </g>
            <path d="M 17.5,26 L 27.5,26" />
            <path d="M 22.5,15 L 22.5,22" />
            <path d="M 19.5,18 L 25.5,18" />
          </g>
        );

      case 'r':
        return isWhite ? (
          <g fill="#ffffff" fillRule="evenodd" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 Z" />
            <path d="M 12,36 L 12,32 L 33,32 L 33,36 Z" />
            <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 Z" />
            <path d="M 12,14 L 33,14 L 31,32 L 14,32 Z" />
          </g>
        ) : (
          <g fill="#000000" fillRule="evenodd" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 Z" />
            <path d="M 12,36 L 12,32 L 33,32 L 33,36 Z" />
            <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 Z" />
            <path d="M 12,14 L 33,14 L 31,32 L 14,32 Z" />
          </g>
        );

      case 'q':
        return isWhite ? (
          <g fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <g fill="#ffffff">
              <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 C 36,26 38,13.5 35.5,11.5 C 33,9.5 30,16.5 30,16.5 C 30,16.5 27,6.5 22.5,6.5 C 18,6.5 15,16.5 15,16.5 C 15,16.5 12,9.5 9.5,11.5 C 7,13.5 9,26 9,26 z" />
              <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,32 12,34 12,34 L 33,34 C 33,34 32.5,32 33.5,30 C 34.5,28 36,28 36,26 C 36,26 31,29.5 22.5,29.5 C 14,29.5 9,26 9,26 z" />
            </g>
            <path d="M 11,38 L 34,38" />
            <circle cx="6" cy="12" r="2" fill="#ffffff" />
            <circle cx="14" cy="9" r="2" fill="#ffffff" />
            <circle cx="22.5" cy="5" r="2" fill="#ffffff" />
            <circle cx="31" cy="9" r="2" fill="#ffffff" />
            <circle cx="39" cy="12" r="2" fill="#ffffff" />
          </g>
        ) : (
          <g fill="none" fillRule="evenodd" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <g fill="#000000">
              <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 C 36,26 38,13.5 35.5,11.5 C 33,9.5 30,16.5 30,16.5 C 30,16.5 27,6.5 22.5,6.5 C 18,6.5 15,16.5 15,16.5 C 15,16.5 12,9.5 9.5,11.5 C 7,13.5 9,26 9,26 z" />
              <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,32 12,34 12,34 L 33,34 C 33,34 32.5,32 33.5,30 C 34.5,28 36,28 36,26 C 36,26 31,29.5 22.5,29.5 C 14,29.5 9,26 9,26 z" />
            </g>
            <path d="M 11,38 L 34,38" />
            <circle cx="6" cy="12" r="2" fill="#000000" />
            <circle cx="14" cy="9" r="2" fill="#000000" />
            <circle cx="22.5" cy="5" r="2" fill="#000000" />
            <circle cx="31" cy="9" r="2" fill="#000000" />
            <circle cx="39" cy="12" r="2" fill="#000000" />
          </g>
        );

      case 'k':
        return isWhite ? (
          <g fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22.5,11.5 L 22.5,6 M 20,8 L 25,8" />
            <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 22.5,11.5 C 24,11.5 21,11.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25 z" fill="#ffffff" />
            <path d="M 11.5,37 C 17,35.5 28,35.5 33.5,37 C 33.5,37 36,26.5 32.5,22.5 C 29,18.5 22.5,22.5 22.5,22.5 C 22.5,22.5 16,18.5 12.5,22.5 C 9,26.5 11.5,37 11.5,37 z" fill="#ffffff" />
            <path d="M 11.5,30 C 17,28.5 28,28.5 33.5,30" />
            <path d="M 11.5,33.5 C 17,32 28,32 33.5,33.5" />
            <path d="M 11.5,37 C 17,35.5 28,35.5 33.5,37" />
          </g>
        ) : (
          <g fill="none" fillRule="evenodd" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22.5,11.5 L 22.5,6 M 20,8 L 25,8" stroke="#ffffff" />
            <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 22.5,11.5 C 24,11.5 21,11.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25 z" fill="#000000" />
            <path d="M 11.5,37 C 17,35.5 28,35.5 33.5,37 C 33.5,37 36,26.5 32.5,22.5 C 29,18.5 22.5,22.5 22.5,22.5 C 22.5,22.5 16,18.5 12.5,22.5 C 9,26.5 11.5,37 11.5,37 z" fill="#000000" />
            <path d="M 11.5,30 C 17,28.5 28,28.5 33.5,30" />
            <path d="M 11.5,33.5 C 17,32 28,32 33.5,33.5" />
            <path d="M 11.5,37 C 17,35.5 28,35.5 33.5,37" />
          </g>
        );
    }
  };

  return (
    <svg viewBox="0 0 45 45" className={className}>
      {renderSvg()}
    </svg>
  );
};
