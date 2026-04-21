import styled from "styled-components"

type BadgeProps = {
    label: string;
    color?: string;
};

const StyledBadge = styled.span<{ color?: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: #fff;
  background-color: ${({ color }) => color || "#999"};
`;

const Badge = ({ label, color }: BadgeProps) => {
    return (
        <StyledBadge color={color}>
            {label}
        </StyledBadge>
    )
}


export default Badge