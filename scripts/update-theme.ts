import { execSync } from 'node:child_process'
import process from 'node:process'

try {
  execSync('git remote | grep template', { stdio: 'ignore' })
}
catch {
  execSync('git remote add template ', { stdio: 'inherit' })
}

try {
  execSync('git fetch template', { stdio: 'inherit' })

  execSync('git merge template/main --allow-unrelated-histories', {
    stdio: 'inherit',
  })
}
catch (error) {
  console.error('Error updating theme.:', error)
  process.exit(1)
}
