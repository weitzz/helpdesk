import styled from 'styled-components'

export const StyledInput = styled.input`
  width: 100%;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  min-height: 40px;
  padding: 10px 12px;
  font-size: 1rem;
  background: #fff;

  &:disabled{
    cursor: not-allowed;
    background: #ececec;
  }

  &:focus{
    outline: none;
    border-color: #181c2e;
  }
`;
