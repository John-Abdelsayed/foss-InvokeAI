import { createMemoizedSelector } from 'app/store/createMemoizedSelector';
import { stateSelector } from 'app/store/store';
import { useAppSelector } from 'app/store/storeHooks';
import { isInvocationNode } from 'features/nodes/types/invocation';
import { useMemo } from 'react';

export const useFieldInputKind = (nodeId: string, fieldName: string) => {
  const selector = useMemo(
    () =>
      createMemoizedSelector(stateSelector, ({ nodes }) => {
        const node = nodes.nodes.find((node) => node.id === nodeId);
        if (!isInvocationNode(node)) {
          return;
        }
        const nodeTemplate = nodes.nodeTemplates[node?.data.type ?? ''];
        const fieldTemplate = nodeTemplate?.inputs[fieldName];
        return fieldTemplate?.input;
      }),
    [fieldName, nodeId]
  );

  const inputKind = useAppSelector(selector);

  return inputKind;
};