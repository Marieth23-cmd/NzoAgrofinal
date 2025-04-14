import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
     
     
      
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        marieth: "#4CAF50",
        cortime:"#999",
        cortexto:"#666",
        tab:"#ddd",
        primary: "#43a047",
        light:" #f5f5f5",
        profile: "#333",
         preto:"#000000",
        branco:"#fff",
        verdeaceso:"#81C784",
        vermelho: "#f44336",
         card:"#f8f9fa",
         th:"#f8f9fa",
         amarela:" #ffd700",
          cinza:" #f8f9fa",
          cinzab:"#e0e0e0",
          rating:"#ffc107",
          laranja:"#Ff914d",
          list:" #f8f8f8",
          padding:"#ff9800",
          pretobranco:"#f0f0f0",
          back: "#e0e0e0",
          back2:"#f9f9f9"
         
         
     },

    
      boxShadow:{
        custom: "0 4px 6px rgba(0,0,0,0.1)",
      },
     


      
    },
  },
  plugins: [],
} satisfies Config;
