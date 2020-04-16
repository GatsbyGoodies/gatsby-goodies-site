import React from 'react'
import { asField, BasicText } from 'informed'

export default asField((props) => {
  const { label, noError, disabled, ...rest } = props
  const error = props.fieldState.error

  return (
    <div>
      {label && <label>{label}</label>}
      <BasicText disabled={disabled} {...rest} />
      {!noError && error && <div className='text-field-error'>{error}</div>}
    </div>
  )
})
