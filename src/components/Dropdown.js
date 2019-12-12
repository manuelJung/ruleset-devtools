// @flow
import * as React from 'react'
import styled from 'styled-components'
import {FaCaretDown} from 'react-icons/fa'

type Props = {
  label: string,
  options: {
    value: string,
    label: string
  }[],
  onChange: (value:string) => mixed
}

export default function Dropdown ({label, options, onChange}:Props) {
  const [open, setOpen] = React.useState(false)
  const openDropdown = () => setOpen(true)
  const closeDropdown = () => setOpen(false)
  const handleChange = opt => () => onChange(opt.value)

  return (
    <Wrapper className='Dropdown'>
      <div className='content' tabindex='1' onFocus={openDropdown} onBlur={closeDropdown}>
        <div className='label'>{label}</div>
        <div className='icon'><FaCaretDown/></div>
      </div>
      {open && (
        <div className='options'>
          {options.map(opt => (
            <div key={opt.label} onMouseDown={handleChange(opt)}>{opt.label}</div>
          ))}
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 160px;
  position: relative;
  color: whitesmoke;
  > .content {
    display: flex;
    border-bottom: 1px solid whitesmoke;
    padding: 8px 3px;
    > .label {flex:1;}
    cursor: pointer;
    &:focus{outline:none;}
  }

  > .options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #4b5e67;
    > div {
      padding: 8px 3px;
      border-bottom: 1px solid whitesmoke;
      cursor: pointer;
    }
  }
`