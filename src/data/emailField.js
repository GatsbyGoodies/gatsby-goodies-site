import { EMAIL } from './regex'

export default {
  field: 'email',
  placeholder: 'you@email.com',
  type: 'email',
  required: true,
  validateOnBlur: true,
  validate: (value) => {
    if (!EMAIL.test(value)) return 'Invalid email'
  }
}
