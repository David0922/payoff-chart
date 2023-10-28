import { Component, createSignal } from 'solid-js';

const CheckBox: Component<{
  btnAttr: [label: string, callback: () => void][];
  selected: string;
}> = props => {
  const [selected, setSelected] = createSignal(props.selected);

  const cls = 'border-b grow hover:bg-neutral-200 px-4 py-2';
  const clsUnselected = cls + ' border-transparent';
  const selectedCls = cls + ' bg-neutral-100 border-neutral-400';

  return (
    <div class='flex'>
      {props.btnAttr.map(([label, callback]) => (
        <button
          class={selected() === label ? selectedCls : clsUnselected}
          onclick={() => {
            if (selected() === label) return;
            setSelected(label);
            callback();
          }}>
          {label}
        </button>
      ))}
    </div>
  );
};

export default CheckBox;
