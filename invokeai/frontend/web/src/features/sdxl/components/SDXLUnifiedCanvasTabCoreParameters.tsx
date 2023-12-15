import { Box, Flex } from '@chakra-ui/react';
import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import IAICollapse from 'common/components/IAICollapse';
import ParamBoundingBoxSize from 'features/parameters/components/Parameters/Canvas/BoundingBox/ParamBoundingBoxSize';
import ParamCFGScale from 'features/parameters/components/Parameters/Core/ParamCFGScale';
import ParamIterations from 'features/parameters/components/Parameters/Core/ParamIterations';
import ParamModelandVAEandScheduler from 'features/parameters/components/Parameters/Core/ParamModelandVAEandScheduler';
import ParamSteps from 'features/parameters/components/Parameters/Core/ParamSteps';
import ParamSeedFull from 'features/parameters/components/Parameters/Seed/ParamSeedFull';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import ParamSDXLImg2ImgDenoisingStrength from './ParamSDXLImg2ImgDenoisingStrength';

const selector = createMemoizedSelector(stateSelector, ({ ui, generation }) => {
  const { shouldUseSliders } = ui;
  const { shouldRandomizeSeed } = generation;

  const activeLabel = !shouldRandomizeSeed ? 'Manual Seed' : undefined;

  return { shouldUseSliders, activeLabel };
});

const SDXLUnifiedCanvasTabCoreParameters = () => {
  const { t } = useTranslation();
  const { shouldUseSliders, activeLabel } = useAppSelector(selector);

  return (
    <IAICollapse
      label={t('parameters.general')}
      activeLabel={activeLabel}
      defaultIsOpen={true}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {shouldUseSliders ? (
          <>
            <ParamIterations />
            <ParamSteps />
            <ParamCFGScale />
            <ParamModelandVAEandScheduler />
            <Box pt={2}>
              <ParamSeedFull />
            </Box>
            <ParamBoundingBoxSize />
          </>
        ) : (
          <>
            <Flex gap={3}>
              <ParamIterations />
              <ParamSteps />
              <ParamCFGScale />
            </Flex>
            <ParamModelandVAEandScheduler />
            <Box pt={2}>
              <ParamSeedFull />
            </Box>
            <ParamBoundingBoxSize />
          </>
        )}
        <ParamSDXLImg2ImgDenoisingStrength />
      </Flex>
    </IAICollapse>
  );
};

export default memo(SDXLUnifiedCanvasTabCoreParameters);