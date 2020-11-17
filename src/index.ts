import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function() {
		joplin.commands.register({
			name: 'linkMaker',
			label: 'Link to corresponding note. Creates it if needed.',
			iconName: 'fas fa-external-link-alt',
			execute: async () => {
				const notes = (await joplin.data.get(['notes']));
				const currentNote = await joplin.workspace.selectedNote();	
				const selectedText = (await joplin.commands.execute('selectedText') as string);
				
				if (selectedText !== ""){
					//console.info('Clic !', selectedText);

					//Check if note already exists
					var idLinkedNote = 0;
					for (let i in notes.items){
						//console.info(notes.items[i].title);
						if (notes.items[i].title.toLowerCase() === selectedText.toLowerCase()){
							idLinkedNote = notes.items[i].id;	
							console.info('Found note with title ', notes.items[i].title, selectedText ,idLinkedNote);
							break;
						}
					}


					//Else : make it:
					if (idLinkedNote === 0){
						const newNote = await joplin.data.post(['notes'], null, { body: "", title: selectedText});
						idLinkedNote = newNote.id
					}

					//console.info(idLinkedNote);
					
					//Insert backlink :
					const backlink = 'Linked from [' + currentNote.title + '](:/' + currentNote.id + ')';
					const bodyLinkedNote = (await joplin.data.get(['notes', idLinkedNote.toString()], { fields: ['body'] })).body;
					const newBodyLinkedNote = bodyLinkedNote + "\n" + backlink;
					await joplin.data.put(['notes', idLinkedNote.toString()], null, { body: newBodyLinkedNote });

					const linkToNewNote = '[' + selectedText + '](:/' + idLinkedNote + ')';

					await joplin.commands.execute('replaceSelection', linkToNewNote);
				}
			},
		});
		
		joplin.views.toolbarButtons.create('linkMaker', ToolbarButtonLocation.EditorToolbar);
	},
});
