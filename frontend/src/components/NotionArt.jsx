import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

/**
 * Notion-Style Vector Cartoon Illustrations
 * Designed with authentic Notion black & white line art aesthetic.
 * Automatically adapts lines, fills, and accents to Light and Dark themes.
 */

// ── 1. Hero Artwork (Home Page) ──
export const NotionHeroArt = ({ width = 320, height = 320, className = "" }) => {
  const { isDark } = useTheme();
  const strokeColor = isDark ? "#f4f4f5" : "#191919";
  const softFill = isDark ? "#222225" : "#f7f6f3";
  const accentColor = isDark ? "#a78bfa" : "#7c3aed";

  return (
    <svg width={width} height={height} viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Floating mood thought bubbles */}
      <g className="notion-floating-bubbles">
        {/* Bubble 1: Heart/Love */}
        <circle cx="85" cy="85" r="22" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
        <path d="M85 91 C80 84, 73 87, 78 93 C85 98, 85 98, 85 98 C85 98, 85 98, 92 93 C97 87, 90 84, 85 91 Z" fill={accentColor} />

        {/* Bubble 2: Flame/Motivation */}
        <circle cx="160" cy="55" r="24" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
        <path d="M160 44 C163 50, 168 53, 165 59 C162 64, 155 64, 153 59 C151 55, 156 50, 160 44 Z" fill={accentColor} />

        {/* Bubble 3: Leaf/Calm */}
        <circle cx="235" cy="85" r="22" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
        <path d="M230 94 C230 84, 242 84, 242 94 C238 97, 230 96, 230 94 Z" stroke={accentColor} strokeWidth="2" fill="none" />
        <path d="M230 94 L239 87" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />

        {/* Bubble 4: Joy/Smiley */}
        <circle cx="265" cy="145" r="18" fill={softFill} stroke={strokeColor} strokeWidth="2.2" />
        <circle cx="260" cy="142" r="1.5" fill={strokeColor} />
        <circle cx="270" cy="142" r="1.5" fill={strokeColor} />
        <path d="M259 148 Q265 153 271 148" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {/* Bubble 5: Droplet/Release */}
        <circle cx="55" cy="145" r="18" fill={softFill} stroke={strokeColor} strokeWidth="2.2" />
        <path d="M55 137 C58 143, 61 147, 55 152 C49 147, 52 143, 55 137 Z" fill={strokeColor} />
      </g>

      {/* Main Character: Meditating / Mindful Thinker */}
      <g>
        {/* Hair Bun */}
        <ellipse cx="160" cy="122" rx="14" ry="11" fill={strokeColor} />
        <path d="M152 124 Q160 116 168 124" stroke={isDark ? "#191919" : "#ffffff"} strokeWidth="2" strokeLinecap="round" />

        {/* Head */}
        <circle cx="160" cy="150" r="25" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />

        {/* Bangs / Hairline */}
        <path d="M137 146 Q150 132 165 136 Q178 134 183 146" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Calm closed eyes */}
        <path d="M149 152 Q154 156 158 152" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M164 152 Q168 156 172 152" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Gentle smile */}
        <path d="M157 161 Q161 164 165 161" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <circle cx="146" cy="156" r="3" fill={accentColor} opacity="0.4" />
        <circle cx="175" cy="156" r="3" fill={accentColor} opacity="0.4" />

        {/* Neck */}
        <path d="M155 175 L155 182 L166 182 L166 175" stroke={strokeColor} strokeWidth="2.5" fill={softFill} />

        {/* Sweater / Body */}
        <path d="M132 205 Q145 183 160 183 Q175 183 189 205 L184 246 L137 246 Z" fill={softFill} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />

        {/* Collar */}
        <path d="M154 183 Q160 189 167 183" stroke={strokeColor} strokeWidth="2.2" fill="none" />

        {/* Arms crossed in peaceful pose */}
        <path d="M132 205 Q125 225 146 235 L160 235" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M189 205 Q196 225 175 235 L160 235" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Crossed Legs (Lotus pose) */}
        <path d="M118 268 C118 250, 142 246, 160 248 C178 246, 203 250, 203 268 C203 273, 195 275, 185 272 L160 266 L136 272 C126 275, 118 273, 118 268 Z" fill={softFill} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />

        {/* Sitting platform shadow */}
        <line x1="95" y1="278" x2="225" y2="278" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="120" y1="284" x2="200" y2="284" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </g>
    </svg>
  );
};

// ── 2. Login Artwork ──
export const NotionLoginArt = ({ width = 240, height = 240, className = "" }) => {
  const { isDark } = useTheme();
  const strokeColor = isDark ? "#f4f4f5" : "#191919";
  const softFill = isDark ? "#222225" : "#f7f6f3";
  const accentColor = isDark ? "#a78bfa" : "#7c3aed";

  return (
    <svg width={width} height={height} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Desk Lamp */}
      <path d="M50 180 L50 110 Q50 90 75 90 L85 90" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M80 80 L105 95 L80 110 Z" fill={softFill} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="80" cy="95" r="4" fill={accentColor} />
      {/* Lamp light ray */}
      <polygon points="106,95 185,150 135,185" fill={accentColor} opacity="0.08" />

      {/* Notion Journal / Book */}
      <rect x="95" y="145" width="80" height="42" rx="4" transform="rotate(-6 95 145)" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
      <line x1="110" y1="150" x2="165" y2="144" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="112" y1="158" x2="158" y2="153" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="114" y1="166" x2="148" y2="162" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Character focused with glasses */}
      <g>
        {/* Head */}
        <circle cx="155" cy="90" r="22" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
        {/* Hair */}
        <path d="M136 85 C136 70, 165 65, 175 75 C179 82, 178 90, 178 90 C172 82, 155 80, 136 85 Z" fill={strokeColor} />
        {/* Glasses */}
        <rect x="144" y="86" width="10" height="9" rx="2" stroke={strokeColor} strokeWidth="2" fill="none" />
        <rect x="159" y="86" width="10" height="9" rx="2" stroke={strokeColor} strokeWidth="2" fill="none" />
        <line x1="154" y1="90" x2="159" y2="90" stroke={strokeColor} strokeWidth="2" />
        {/* Smile */}
        <path d="M152 102 Q158 105 163 102" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Body reading */}
        <path d="M132 125 Q145 112 158 112 Q172 112 182 125 L180 160 L130 160 Z" fill={softFill} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M140 128 L122 152 L138 155" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Desk line */}
      <line x1="30" y1="188" x2="210" y2="188" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Key / Lock icon motif */}
      <circle cx="190" cy="70" r="8" stroke={accentColor} strokeWidth="2" fill="none" />
      <path d="M190 78 L190 92 M187 87 L193 87" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// ── 3. Signup Artwork ──
export const NotionSignupArt = ({ width = 240, height = 240, className = "" }) => {
  const { isDark } = useTheme();
  const strokeColor = isDark ? "#f4f4f5" : "#191919";
  const softFill = isDark ? "#222225" : "#f7f6f3";
  const accentColor = isDark ? "#a78bfa" : "#7c3aed";

  return (
    <svg width={width} height={height} viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Potted Plant */}
      <path d="M40 170 L45 190 L65 190 L70 170 Z" fill={softFill} stroke={strokeColor} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M55 170 Q45 145 35 150 Q48 160 55 170 Z" fill={accentColor} opacity="0.7" stroke={strokeColor} strokeWidth="1.5" />
      <path d="M55 170 Q60 140 75 145 Q65 158 55 170 Z" fill={accentColor} opacity="0.7" stroke={strokeColor} strokeWidth="1.5" />

      {/* Welcome Character waving */}
      <g>
        {/* Head */}
        <circle cx="125" cy="85" r="22" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
        {/* Hair with curl */}
        <path d="M106 80 Q125 60 145 75 Q150 82 147 90 Q135 78 106 80 Z" fill={strokeColor} />
        {/* Eyes open and cheerful */}
        <circle cx="120" cy="84" r="2" fill={strokeColor} />
        <circle cx="132" cy="84" r="2" fill={strokeColor} />
        {/* Happy smile */}
        <path d="M121 93 Q126 98 131 93" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Cheeks */}
        <circle cx="115" cy="89" r="2.5" fill={accentColor} opacity="0.5" />
        <circle cx="137" cy="89" r="2.5" fill={accentColor} opacity="0.5" />

        {/* Body */}
        <path d="M105 120 Q125 107 145 120 L142 165 L108 165 Z" fill={softFill} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
        
        {/* Waving Arm */}
        <path d="M145 120 Q165 105 172 85" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Waving Hand */}
        <circle cx="174" cy="82" r="5" fill={softFill} stroke={strokeColor} strokeWidth="2" />

        {/* Left Arm holding notebook */}
        <path d="M105 120 Q95 138 108 148" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="98" y="135" width="22" height="28" rx="3" fill={softFill} stroke={strokeColor} strokeWidth="2" />
        <line x1="104" y1="142" x2="114" y2="142" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <line x1="104" y1="148" x2="114" y2="148" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Sparkles */}
      <path d="M190 60 L193 68 L201 71 L193 74 L190 82 L187 74 L179 71 L187 68 Z" fill={accentColor} />
      <path d="M90 55 L92 60 L97 62 L92 64 L90 69 L88 64 L83 62 L88 60 Z" fill={accentColor} opacity="0.6" />

      {/* Floor ground line */}
      <line x1="25" y1="195" x2="215" y2="195" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};

// ── 4. Chat Empty State / Companion Artwork ──
export const NotionChatArt = ({ width = 180, height = 180, className = "" }) => {
  const { isDark } = useTheme();
  const strokeColor = isDark ? "#f4f4f5" : "#191919";
  const softFill = isDark ? "#222225" : "#f7f6f3";
  const accentColor = isDark ? "#a78bfa" : "#7c3aed";

  return (
    <svg width={width} height={height} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Listening Headset */}
      <path d="M60 75 C60 48, 120 48, 120 75" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="53" y="70" width="10" height="18" rx="5" fill={accentColor} stroke={strokeColor} strokeWidth="2" />
      <rect x="117" y="70" width="10" height="18" rx="5" fill={accentColor} stroke={strokeColor} strokeWidth="2" />

      {/* Head */}
      <circle cx="90" cy="78" r="22" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
      
      {/* Relaxed / Listening Eyes */}
      <path d="M79 77 Q83 81 87 77" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M93 77 Q97 81 101 77" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Warm gentle smile */}
      <path d="M86 86 Q90 90 94 86" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <circle cx="77" cy="82" r="3" fill={accentColor} opacity="0.4" />
      <circle cx="103" cy="82" r="3" fill={accentColor} opacity="0.4" />

      {/* Warm cup of tea / coffee in hands */}
      <g>
        <path d="M72 110 Q90 98 108 110 L104 140 L76 140 Z" fill={softFill} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
        {/* Mug */}
        <rect x="83" y="120" width="14" height="16" rx="2" fill={softFill} stroke={strokeColor} strokeWidth="2" />
        <path d="M97 124 Q102 128 97 132" stroke={strokeColor} strokeWidth="1.5" fill="none" />
        {/* Steam */}
        <path d="M88 116 Q90 112 88 108" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M92 116 Q94 112 92 108" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Supportive heart aura */}
      <path d="M90 30 C86 24, 80 27, 84 32 C90 37, 90 37, 90 37 C90 37, 90 37, 96 32 C100 27, 94 24, 90 30 Z" fill={accentColor} />

      {/* Bottom base line */}
      <line x1="50" y1="152" x2="130" y2="152" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
};

// ── 5. Mood Modal Artwork ──
export const NotionMoodArt = ({ width = 120, height = 120, className = "" }) => {
  const { isDark } = useTheme();
  const strokeColor = isDark ? "#f4f4f5" : "#191919";
  const softFill = isDark ? "#222225" : "#f7f6f3";
  const accentColor = isDark ? "#a78bfa" : "#7c3aed";

  return (
    <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Character with hand on chin checking in */}
      <circle cx="60" cy="50" r="24" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
      <path d="M42 45 Q60 28 78 40 Q84 48 81 55 Q70 42 42 45 Z" fill={strokeColor} />
      
      {/* Curious / thoughtful eyes */}
      <circle cx="53" cy="48" r="2.5" fill={strokeColor} />
      <circle cx="67" cy="48" r="2.5" fill={strokeColor} />
      
      {/* Soft thoughtful smile */}
      <path d="M57 58 Q62 62 67 58" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      
      {/* Hand touching chin */}
      <path d="M68 58 Q74 65 70 75" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="70" cy="62" r="3.5" fill={softFill} stroke={strokeColor} strokeWidth="1.8" />

      {/* Floating sparkles */}
      <path d="M96 28 L98 33 L103 35 L98 37 L96 42 L94 37 L89 35 L94 33 Z" fill={accentColor} />
      <path d="M25 32 L26 35 L29 36 L26 37 L25 40 L24 37 L21 36 L24 35 Z" fill={accentColor} opacity="0.6" />
    </svg>
  );
};

// ── 6. Profile Artwork ──
export const NotionProfileArt = ({ width = 160, height = 160, className = "" }) => {
  const { isDark } = useTheme();
  const strokeColor = isDark ? "#f4f4f5" : "#191919";
  const softFill = isDark ? "#222225" : "#f7f6f3";
  const accentColor = isDark ? "#a78bfa" : "#7c3aed";

  return (
    <svg width={width} height={height} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Growth chart line behind avatar */}
      <path d="M25 110 L55 85 L85 95 L115 60 L140 45" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" strokeDasharray="3 3" />
      
      {/* Star at peak */}
      <polygon points="140,38 143,45 150,45 144,49 146,56 140,52 134,56 136,49 130,45 137,45" fill={accentColor} />

      {/* Notion Avatar Card */}
      <circle cx="80" cy="80" r="40" fill={softFill} stroke={strokeColor} strokeWidth="2.5" />
      
      {/* Character inside profile */}
      <circle cx="80" cy="72" r="18" fill={softFill} stroke={strokeColor} strokeWidth="2" />
      <path d="M66 68 C66 55, 94 55, 94 68 C88 64, 76 64, 66 68 Z" fill={strokeColor} />
      <circle cx="75" cy="72" r="2" fill={strokeColor} />
      <circle cx="85" cy="72" r="2" fill={strokeColor} />
      <path d="M77 78 Q80 81 83 78" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      
      {/* Shoulders */}
      <path d="M56 112 Q80 98 104 112" stroke={strokeColor} strokeWidth="2.5" fill={softFill} />
    </svg>
  );
};
