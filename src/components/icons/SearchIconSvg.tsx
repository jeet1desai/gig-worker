import { JSX, SVGProps } from 'react';

export default function SearchIconSvg(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx={5.8} cy={5.39457} rx={4.8} ry={4.8162} stroke="#676767" />
      <path d="M13 13.4215L9 9.40796" stroke="#676767" strokeLinecap="round" />
    </svg>
  );
}
