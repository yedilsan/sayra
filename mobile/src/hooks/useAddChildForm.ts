import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as childrenApi from '@/api/children';
import { useInvalidateChildren } from '@/hooks/useChildren';
import { useChildStore } from '@/store/child-store';
import { mapAuthError } from '@/utils/auth-errors';

export function useAddChildForm(onSuccess?: () => void) {
  const { t } = useTranslation();
  const invalidateChildren = useInvalidateChildren();
  const setActiveChildId = useChildStore((state) => state.setActiveChildId);

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: childrenApi.createChild,
    onSuccess: async (child) => {
      // Select the new child before refetching so the app gate sees a valid selection
      // in the same pass and can advance straight out of onboarding.
      setActiveChildId(child.id);
      await invalidateChildren();
      onSuccess?.();
    },
    onError: (err) => {
      // Without this a failed POST left the screen completely silent, which is
      // indistinguishable from a dead button.
      const mapped = mapAuthError(err, t);
      setError(mapped.formError ?? Object.values(mapped.fieldErrors)[0] ?? t('common.somethingWentWrong'));
    },
  });

  function submit() {
    // Guard against a second tap landing while the first request is still in flight.
    if (mutation.isPending) {
      return;
    }

    setError(null);
    if (!name.trim() || age === null) {
      setError(t('onboarding.errorMissingFields'));
      return;
    }
    mutation.mutate({ name: name.trim(), age });
  }

  return {
    name,
    setName,
    age,
    setAge,
    error,
    submit,
    isPending: mutation.isPending,
  };
}
