// Quick test of our text display implementation
import { TextRenderer, createDefaultTimeline } from './TextRenderer.js'

// Test the timeline
const timeline = createDefaultTimeline()

console.log('Timeline messages:')
timeline.messages.forEach((msg, i) => {
  console.log(`${i + 1}. "${msg.text}" at ${msg.startTime}s for ${msg.endTime - msg.startTime}s`)
})

// Test specific times
const testTimes = [54, 55, 56, 60, 65, 70, 75, 80, 85, 90]
testTimes.forEach((time) => {
  const message = timeline.getCurrentMessage(time)
  console.log(`Time ${time}s: ${message ? `"${message.text}"` : 'No text'}`)
})

// Test text renderer (would need DOM environment)
if (typeof document !== 'undefined') {
  const renderer = new TextRenderer()

  // Test canvas rendering
  const testTexts = ['HELLO', 'THANK YOU', '恭喜發財', '2025']
  testTexts.forEach((text) => {
    const textureData = renderer.renderText(text)
    console.log(`Rendered "${text}": ${textureData.length} bytes`)
  })
}
