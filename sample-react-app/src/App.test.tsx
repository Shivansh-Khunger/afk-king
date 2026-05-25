import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('renders App and increments count', async () => {
  render(<App />)
  
  // Verify initial state
  const heading = screen.getByText(/Get started/i)
  expect(heading).toBeInTheDocument()
  
  const button = screen.getByRole('button', { name: /Count is 0/i })
  expect(button).toBeInTheDocument()
  
  // Interaction
  await fireEvent.click(button)
  
  // Verify updated state
  expect(screen.getByRole('button', { name: /Count is 1/i })).toBeInTheDocument()
})
