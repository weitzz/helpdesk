import styled from "styled-components";

export const StyledPagination = styled.div`
  margin: 24px 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f7f7f7;
  border-radius: 4px;
  padding: 16px;

  span {
    color: #181c2e;
    font-weight: 600;
  }

  .pages {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  button {
    background: #fff;
    color: #181c2e;
    border: 1px solid #181c2e;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
  }
  button:hover:not(:disabled) {
    background: #181c2e;
    color: #fff;
  }

  button.active {
    background: #181c2e;
    color: #fff;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;

    .pages {
      justify-content: center;
    }
  }
`;