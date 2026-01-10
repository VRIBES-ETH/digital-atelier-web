import { Extension } from '@tiptap/core';

const CustomShortcuts = Extension.create({
    name: 'customShortcuts',

    addKeyboardShortcuts() {
        return {
            'Mod-k': () => {
                const { editor } = this;
                if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run();
                } else {
                    const url = window.prompt('URL del enlace:');
                    if (url) {
                        editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
                    }
                }
                return true;
            },
            // Add more shortcuts as needed
        };
    },
});

export default CustomShortcuts;
