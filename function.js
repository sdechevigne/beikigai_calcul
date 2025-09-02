window.function = function (prenoms, nom, jour, mois, annee) {
	// Récupération des valeurs depuis Glide
	prenoms = prenoms.value ?? "";
	nom = nom.value ?? "";
	jour = parseInt(jour.value) ?? 1;
	mois = parseInt(mois.value) ?? 1;
	annee = parseInt(annee.value) ?? 1900;

	// Configuration des constantes
	const lettreValeur = {
		'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
		'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
		'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
	};

	const voyelles = ['A', 'E', 'I', 'O', 'U', 'Y'];
	const maitresNombres = [11, 22, 33];
	const memoiresFamiliales = [13, 14, 16, 19];

	// Fonctions utilitaires
	function normaliserTexte(texte) {
		return texte.toUpperCase()
			.replace(/[ÉÈÊË]/g, 'E')
			.replace(/[ÀÂÄÃ]/g, 'A')
			.replace(/[ÎÏÌ]/g, 'I')
			.replace(/[ÔÖÒÕ]/g, 'O')
			.replace(/[ÛÜÙŨ]/g, 'U')
			.replace(/Ç/g, 'C')
			.replace(/Ñ/g, 'N');
	}

	function reduireNombre(nombre) {
		while (nombre > 9 && !maitresNombres.includes(nombre)) {
			const str = nombre.toString();
			nombre = str.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
		}
		return nombre;
	}

	function calculerValeurNom(nom) {
		const nomNormalise = normaliserTexte(nom.replace(/-/g, ''));
		let total = 0;
		for (let lettre of nomNormalise) {
			if (lettreValeur[lettre]) {
				total += lettreValeur[lettre];
			}
		}
		return total;
	}

	function calculerRacine1(jour, mois, annee, slash) {
		const total1 = jour + mois + annee;
		const reduit1 = reduireNombre(total1);

		const dateStr = `${jour.toString().padStart(2, '0')}${mois.toString().padStart(2, '0')}${annee}`;
		const total2 = dateStr.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
		const reduit2 = reduireNombre(total2);

		const jourReduit = reduireNombre(jour);
		const moisReduit = reduireNombre(mois);
		const anneeReduite = reduireNombre(annee);
		const total3 = jourReduit + moisReduit + anneeReduite;
		const reduit3 = reduireNombre(total3);

		if (maitresNombres.includes(total2) || memoiresFamiliales.includes(total2)) {
			return slash ? `${reduit2}` : `${total2}/${reduit2}`;
		}
		if (maitresNombres.includes(total3) || memoiresFamiliales.includes(total3)) {
			return slash ? `${reduit3}` : `${total3}/${reduit3}`;
		}
		if (maitresNombres.includes(total1) || memoiresFamiliales.includes(total1)) {
			return slash ? `${reduit1}` : `${total1}/${reduit1}`;
		}

		return reduit1.toString();
	}

	function calculerRacine2(prenoms, nom, slash) {
		const texteComplet = prenoms + ' ' + nom;
		const total = calculerValeurNom(texteComplet);
		const reduit = reduireNombre(total);

		if (maitresNombres.includes(total) || memoiresFamiliales.includes(total)) {
			return slash ? `${reduit}` : `${total}/${reduit}`;
		}

		return reduit.toString();
	}

	function calculerTronc(jour, mois, slash) {
		const total1 = jour + mois;
		const reduit1 = reduireNombre(total1);

		const jourReduit = reduireNombre(jour);
		const moisReduit = reduireNombre(mois);
		const total2 = jourReduit + moisReduit;
		const reduit2 = reduireNombre(total2);

		if (maitresNombres.includes(total1) || memoiresFamiliales.includes(total1)) {
			return slash ? `${reduit1}` : `${total1}/${reduit1}`;
		}
		if (maitresNombres.includes(total2) || memoiresFamiliales.includes(total2)) {
			return slash ? `${reduit2}` : `${total2}/${reduit2}`;
		}

		return reduit1.toString();
	}

	function calculerDynamique(racine1, racine2, tronc,	 slash) {
		const val1 = parseInt(racine1.split('/')[0] || racine1);
		const val2 = parseInt(racine2.split('/')[0] || racine2);
		const val3 = parseInt(tronc.split('/')[0] || tronc);

		const total = val1 + val2 + val3;
		const reduit = reduireNombre(total);

		if (maitresNombres.includes(total)) {
			return slash ? `${reduit}` : `${total}/${reduit}`;
		}
		return reduit.toString();
	}

	function calculerEcorce(jour) {
		return reduireNombre(jour).toString();
	}

	function calculerBranches(prenoms, nom) {
		const texteComplet = normaliserTexte(prenoms + ' ' + nom);
		let count = 0;
		for (let lettre of texteComplet) {
			if (['A', 'J', 'S'].includes(lettre)) {
				count++;
			}
		}
		return count.toString();
	}

	function calculerFeuilles(prenoms, nom, slash) {
		const texteComplet = normaliserTexte(prenoms + ' ' + nom);
		let total = 0;
		for (let lettre of texteComplet) {
			if (voyelles.includes(lettre) && lettreValeur[lettre]) {
				total += lettreValeur[lettre];
			}
		}
		const reduit = reduireNombre(total);

		if (maitresNombres.includes(total) || memoiresFamiliales.includes(total)) {
			return slash ? `${reduit}` : `${total}/${reduit}`;
		}
		return reduit.toString();
	}

	function calculerFruits(prenoms, nom, slash) {
		const texteComplet = normaliserTexte(prenoms + ' ' + nom);
		let total = 0;
		for (let lettre of texteComplet) {
			if (!voyelles.includes(lettre) && lettreValeur[lettre]) {
				total += lettreValeur[lettre];
			}
		}
		const reduit = reduireNombre(total);

		if (maitresNombres.includes(total) || memoiresFamiliales.includes(total)) {
			return slash ? `${reduit}` : `${total}/${reduit}`;
		}
		return reduit.toString();
	}

	function calculerQualites(prenoms, nom) {
		const texteComplet = normaliserTexte(prenoms + ' ' + nom);
		const qualites = {
			1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
			6: 0, 7: 0, 8: 0, 9: 0
		};

		for (let lettre of texteComplet) {
			if (lettreValeur[lettre]) {
				qualites[lettreValeur[lettre]]++;
			}
		}

		// Réduire les nombres > 9
		for (let key in qualites) {
			if (qualites[key] > 9) {
				qualites[key] = reduireNombre(qualites[key]);
			}
		}

		return qualites;
	}

	function chercherMemoires(prenoms, nom, jour, mois, annee) {
		const memoires = [];

		// Recalculer les valeurs nécessaires
		const racine1 = calculerRacine1(jour, mois, annee, '1');
		const racine2 = calculerRacine2(prenoms, nom, '1');
		const tronc = calculerTronc(jour, mois, '1');
		const feuilles = calculerFeuilles(prenoms, nom, '1');
		const fruits = calculerFruits(prenoms, nom, '1');

		// Jour de naissance
		if (memoiresFamiliales.includes(jour)) {
			memoires.push({ nombre: jour, lieu: 'Jour de naissance', importance: 'Très forte' });
		}

		// Année de naissance
		const totalAnnee = annee.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
		if (memoiresFamiliales.includes(totalAnnee)) {
			memoires.push({ nombre: totalAnnee, lieu: 'Année de naissance', importance: 'Très forte' });
		}

		// Dans les racines et tronc
		const checkMemoire = (valeur, lieu, importance) => {
			if (valeur.includes('/')) {
				const sousNombre = parseInt(valeur.split('/')[0]);
				if (memoiresFamiliales.includes(sousNombre)) {
					memoires.push({ nombre: sousNombre, lieu, importance });
				}
			}
		};

		checkMemoire(racine1, 'Première racine (Chemin de vie)', 'Très forte');
		checkMemoire(racine2, 'Seconde racine (Expression)', 'Très forte');
		checkMemoire(tronc, 'Tronc (Clé de l\'âme)', 'Très forte');
		checkMemoire(feuilles, 'Feuilles (Besoins affectifs)', 'Forte');
		checkMemoire(fruits, 'Fruits (Besoins de réalisation)', 'Forte');

		return memoires + racine1;
	}

	function calculerDefis(jour, mois, annee) {
		const jourReduit = reduireNombre(jour);
		const moisReduit = reduireNombre(mois);
		const anneeReduite = reduireNombre(annee);

		let defi1 = Math.abs(jourReduit - moisReduit);
		let defi2 = Math.abs(jourReduit - anneeReduite);
		let defi3 = Math.abs(defi1 - defi2);
		let defi4 = Math.abs(moisReduit - anneeReduite);

		// Remplacer 0 par 9
		if (defi1 === 0) defi1 = 9;
		if (defi2 === 0) defi2 = 9;
		if (defi3 === 0) defi3 = 9;
		if (defi4 === 0) defi4 = 9;

		return { defi1, defi2, defi3, defi4 };
	}

	function calculerAnneePersonnelle(jour, mois, anneeActuelle) {
		const total = jour + mois + anneeActuelle;
		return reduireNombre(total);
	}

	// Calcul principal de la numérologie
	const racine1 = calculerRacine1(jour, mois, annee);
	const racine2 = calculerRacine2(prenoms, nom);
	const tronc = calculerTronc(jour, mois);
	const dynamique = calculerDynamique(racine1, racine2, tronc);
	const ecorce = calculerEcorce(jour);
	const branches = calculerBranches(prenoms, nom);
	const feuilles = calculerFeuilles(prenoms, nom);
	const fruits = calculerFruits(prenoms, nom);
	const qualites = calculerQualites(prenoms, nom);
	const memoires = chercherMemoires(prenoms, nom, jour, mois, annee);
	const defis = calculerDefis(jour, mois, annee);
	const anneePersonnelle = calculerAnneePersonnelle(jour, mois, new Date().getFullYear());

	// Retourner le résultat complet en JSON
	const resultat = {
		racine1,
		racine2,
		tronc,
		dynamique,
		ecorce,
		branches,
		feuilles,
		fruits,
		qualites,
		memoires,
		defis,
		anneePersonnelle
	};

	return JSON.stringify(resultat);
};
