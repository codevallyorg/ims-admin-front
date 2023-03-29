import { FC } from 'react';

type FairPayLogoProps = {
  width?: string;
  height?: string;
};

const FairPayLogo: FC<FairPayLogoProps> = ({
  width = '164',
  height = '50',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 164 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="164" height="50" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_624_98018"
            transform="matrix(0.00401155 0 0 0.0131579 0.0125963 0)"
          />
        </pattern>
        <image
          id="image0_624_98018"
          width="243"
          height="76"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default FairPayLogo;
