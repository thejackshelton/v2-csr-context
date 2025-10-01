import {
  type Signal,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
} from "@qwik.dev/core";

// Simulate CheckboxRoot - provides checkbox context
type CheckboxContext = {
  checkedSig: Signal<boolean>;
  localId: string;
};

const checkboxContextId = createContextId<CheckboxContext>("test-checkbox");

const CheckboxRoot = component$<any>((props) => {
  const checkedSig = useSignal(false);
  const localId = "checkbox-1";

  // Using useStore like we fixed
  const context = useStore<CheckboxContext>({
    checkedSig,
    localId,
  });

  useContextProvider(checkboxContextId, context);

  return <div data-testid="checkbox-root" {...props} />;
});

const CheckboxTrigger = component$(() => {
  const context = useContext(checkboxContextId);

  return (
    <button
      type="button"
      data-testid="checkbox-trigger"
      onClick$={() => {
        context.checkedSig.value = !context.checkedSig.value;
      }}
    >
      Toggle
    </button>
  );
});

// Simulate ChecklistRoot - HOC that wraps CheckboxRoot
type ChecklistContext = {
  isAllCheckedSig: Signal<boolean>;
  currItemIndex: number; // Primitive like the real code!
};

const checklistContextId = createContextId<ChecklistContext>("test-checklist");

const ChecklistRoot = component$<any>((props) => {
  const isAllCheckedSig = useSignal(false);
  const currItemIndex = 0;

  // Plain object context like the real ChecklistRoot
  const context: ChecklistContext = {
    isAllCheckedSig,
    currItemIndex,
  };

  useContextProvider(checklistContextId, context);

  // HOC wrapping CheckboxRoot
  return <CheckboxRoot {...props} />;
});

const TestApp = component$(() => {
  const showSig = useSignal(false);

  return (
    <div>
      <button
        type="button"
        data-testid="show"
        onClick$={() => {
          showSig.value = true;
        }}
      >
        Show
      </button>

      {showSig.value && (
        <ChecklistRoot>
          <CheckboxTrigger />
        </ChecklistRoot>
      )}
    </div>
  );
});

export default component$(() => {
  return <TestApp />;
});
