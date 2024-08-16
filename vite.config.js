import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('VITE_CLOUDINARY_CLOUD_NAME:', process.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('VITE_CLOUDINARY_UPLOAD_PRESET:', process.env.VITE_CLOUDINARY_UPLOAD_PRESET);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
