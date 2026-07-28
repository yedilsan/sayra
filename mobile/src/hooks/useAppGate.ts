import { useEffect } from 'react';

import { useChildStore } from '@/store/child-store';
import { useChildren } from './useChildren';
import type { Child } from '@/types';

export type AppGateStatus =
  | { status: 'unauthed' }
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
  | { status: 'onboarding'; screen: 'add-child' | 'who-is-practicing'; children: Child[] }
  | { status: 'ready' };

/**
 * Decides whether an authed user should land on the onboarding flow (no children yet,
 * or an ambiguous multi-child selection) or go straight into the tabbed app. Auto-selects
 * the active child when there's only one, or when a previously remembered child is still valid.
 */
export function useAppGate(isAuthed: boolean): AppGateStatus {
  const childrenQuery = useChildren();
  const activeChildId = useChildStore((state) => state.activeChildId);
  const setActiveChildId = useChildStore((state) => state.setActiveChildId);

  const children = childrenQuery.data;

  useEffect(() => {
    if (!children || children.length === 0) {
      return;
    }
    const activeStillValid = children.some((child) => child.id === activeChildId);
    if (!activeStillValid && children.length === 1) {
      setActiveChildId(children[0].id);
    }
  }, [children, activeChildId, setActiveChildId]);

  if (!isAuthed) {
    return { status: 'unauthed' };
  }

  if (childrenQuery.isPending) {
    return { status: 'loading' };
  }

  if (childrenQuery.isError || !children) {
    return { status: 'error', retry: () => childrenQuery.refetch() };
  }

  if (children.length === 0) {
    return { status: 'onboarding', screen: 'add-child', children };
  }

  const activeStillValid = children.some((child) => child.id === activeChildId);
  if (activeStillValid) {
    return { status: 'ready' };
  }

  if (children.length === 1) {
    return { status: 'loading' };
  }

  return { status: 'onboarding', screen: 'who-is-practicing', children };
}
