import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        color: #333;
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
    }

    body::before {
        content: '';
        position: fixed;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: gridMove 20s linear infinite;
        pointer-events: none;
    }

    @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
    }

    #root {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        position: relative;
        z-index: 1;
    }
`;

export const theme = {
    colors: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        primarySolid: '#7c3aed',
        primaryDark: '#6d28d9',
        secondary: '#06b6d4',
        accent: '#ec4899',
        background: '#1a1625',
        surface: '#251e35',
        surfaceLight: '#2d2640',
        text: '#e5e7eb',
        textSecondary: '#9ca3af',
        border: '#3f3553',
        glow: 'rgba(139, 92, 246, 0.5)',
    },

    shadows: {
        lg: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        glow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
    },
    borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
    },
};
