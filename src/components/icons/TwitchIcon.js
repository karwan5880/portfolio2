import { motion } from 'framer-motion'

export const TwitchIcon = ({ variants }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants}
    />
  </svg>
)
