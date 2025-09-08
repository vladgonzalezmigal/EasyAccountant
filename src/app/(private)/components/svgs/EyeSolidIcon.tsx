import { SVGIconProps } from '@/app/(private)/utils/styling';

export default function EyeSolidIcon({ style, className }: SVGIconProps) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 576 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
    >
      <path
        d="M572.52 241.4C518.91 135.66 407.81 64 288 64S57.09 135.66 3.48 241.4a48.06 48.06 0 0 0 0 29.2C57.09 376.34 168.19 448 288 448s230.91-71.66 284.52-177.4a48.06 48.06 0 0 0 0-29.2zM288 400c-79.41 0-144-64.59-144-144s64.59-144 144-144 144 64.59 144 144-64.59 144-144 144zm0-240a95.9 95.9 0 0 0-96 96c0 53.02 42.98 96 96 96s96-42.98 96-96a95.9 95.9 0 0 0-96-96z"
        fill="currentColor"
      />
    </svg>
  );
}
