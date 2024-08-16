"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { trpc } from "@/server/client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import useSpellbookStore from "@/store/spellbookStore";

//without + complains because of the string format but we change it to number
export default function SpellbookPage({
	params,
}: {
	params: { spellbook: number };
}) {
	const spellbook = trpc.spellbooks.getById.useQuery({
		id: +params.spellbook,
	});
	//add mutation for upload spell
	const addSpell = trpc.spells.create.useMutation();
	const delSpell = trpc.spells.delete.useMutation();

	//follow same logic like spellbook
	const addNewSpell = () => {
		//prevent undefined
		if (!spellbook.data?.id) {
			return;
		}

		//prevent null
		if (fileRef.current?.files) {
			//add image
			const formData = new FormData();
			const file = fileRef.current.files[0];
			//upload image file through route
			formData.append("files", file);
			//fetch image "formData" that we implemented before
			const request = { method: "POST", body: formData };
			//upload file in the public folder
			fetch("/api/file", request);

			addSpell.mutate(
				{
					title,
					description,
					spellbookId: spellbook.data?.id,
					//wrap file name `/${file.name}
					image: `/${file.name}`,
				},
				{
					//function added instead to be asynchronous no refresh needed
					onSettled: () => spellbook.refetch(),
				}
			);

			resetFields();
			// setTitle("");
			// setDescription("");
		}
	};

	const deleteSpell = (id: number) => {
		delSpell.mutate(
			{
				id,
			},
			{
				//async func
				onSettled: () => spellbook.refetch(),
			}
		);
	};

	// zustand to replace state
	// const [title, setTitle] = useState<string>("");
	// const [description, setDescription] = useState<string>("");

	// Get state and actions from the Zustand store
	const { title, description, setTitle, setDescription, resetFields } =
		useSpellbookStore();

	//upload ref
	const fileRef = useRef<HTMLInputElement>(null);

	return (
		<div className="p-24">
			<Dialog>
				<DialogTrigger asChild>
					<Button>Add Spell</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create your spell</DialogTitle>
						<DialogDescription>
							Add some powerful spell to your {spellbook.data?.title}
						</DialogDescription>
						<div className="flex flex-col gap-3">
							<p>Title:</p>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<p>Description:</p>
							<Input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
							<p>Image:</p>
							<Input type="file" ref={fileRef} />
							<Button onClick={addNewSpell}>Save</Button>
						</div>
					</DialogHeader>
				</DialogContent>
			</Dialog>
			<Table>
				<TableCaption>Spells from {spellbook.data?.title}.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Image</TableHead>
						<TableHead>Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{spellbook.data?.spells.map((spell) => (
						<TableRow key={spell.id}>
							<TableCell>{spell.title}</TableCell>
							<TableCell>{spell.description}</TableCell>
							<TableCell>
								{/* if image exist then display prevent error */}
								{spell.image && (
									<Image
										src={spell.image}
										width={50}
										height={50}
										alt={spell.title}
									/>
								)}
							</TableCell>
							<TableCell>
								<Button onClick={() => deleteSpell(spell.id)}>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
