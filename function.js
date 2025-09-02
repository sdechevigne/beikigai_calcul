window.function = function (prenoms, nom, jour, mois, annee) {
	// Récupération et validation des valeurs depuis Glide
	prenoms = prenoms?.value ?? "";
	nom = nom?.value ?? "";
	jour = parseInt(jour?.value) || 1;
	mois = parseInt(mois?.value) || 1;
	annee = parseInt(annee?.value) || 1900;

	// Configuration des constantes
	const LETTRE_VALEUR = Object.freeze({
		'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
		'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
		'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
	});

	const VOYELLES = Object.freeze(new Set(['A', 'E', 'I', 'O', 'U', 'Y']));
	const MAITRES_NOMBRES = Object.freeze(new Set([11, 22, 33]));
	const MEMOIRES_FAMILIALES = Object.freeze(new Set([13, 14, 16, 19]));

	// Fonctions utilitaires
	const normaliserTexte = (texte) => {
		const substitutions = {
			'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
			'À': 'A', 'Â': 'A', 'Ä': 'A', 'Ã': 'A',
			'Î': 'I', 'Ï': 'I', 'Ì': 'I',
			'Ô': 'O', 'Ö': 'O', 'Ò': 'O', 'Õ': 'O',
			'Û': 'U', 'Ü': 'U', 'Ù': 'U', 'Ũ': 'U',
			'Ç': 'C', 'Ñ': 'N'
		};
		
		let resultat = texte.toUpperCase();
		for (const [accent, lettre] of Object.entries(substitutions)) {
			resultat = resultat.replace(new RegExp(accent, 'g'), lettre);
		}
		return resultat;
	};

	const reduireNombre = (nombre) => {
		while (nombre > 9 && !MAITRES_NOMBRES.has(nombre)) {
			nombre = nombre.toString()
				.split('')
				.reduce((sum, digit) => sum + parseInt(digit, 10), 0);
		}
		return nombre;
	};

	const calculerValeurNom = (nom) => {
		return normaliserTexte(nom.replace(/-/g, ''))
			.split('')
			.reduce((total, lettre) => total + (LETTRE_VALEUR[lettre] || 0), 0);
	};

	// Calculs principaux avec traçage des valeurs intermédiaires
	const calculerRacine1 = (jour, mois, annee) => {
		// Méthode 1: somme directe (la plus courante en numérologie)
		const sommeDirecte = jour + mois + annee;
		
		// Méthode 2: somme des chiffres de la date complète
		const dateComplete = `${jour.toString().padStart(2, '0')}${mois.toString().padStart(2, '0')}${annee}`;
		const sommeChiffres = dateComplete
			.split('')
			.reduce((sum, digit) => sum + parseInt(digit, 10), 0);
		
		// Méthode 3: somme des nombres réduits
		const sommeReduite = reduireNombre(jour) + reduireNombre(mois) + reduireNombre(annee);
		
		// Retourne toutes les valeurs intermédiaires pour vérification des mémoires
		return {
			valeurs: [sommeDirecte, sommeChiffres, sommeReduite],
			valeurFinale: reduireNombre(sommeDirecte)
		};
	};

	const calculerRacine2 = (prenoms, nom) => {
		const total = calculerValeurNom(`${prenoms} ${nom}`);
		return {
			valeurs: [total],
			valeurFinale: reduireNombre(total)
		};
	};

	const calculerTronc = (jour, mois) => {
		const sommeDirecte = jour + mois;
		const sommeReduite = reduireNombre(jour) + reduireNombre(mois);
		
		// Pour le tronc, on vérifie les deux méthodes
		return {
			valeurs: [sommeDirecte, sommeReduite],
			valeurFinale: reduireNombre(sommeDirecte)
		};
	};

	const calculerValeursTexte = (prenoms, nom, filtreFonction) => {
		const texteComplet = normaliserTexte(`${prenoms} ${nom}`);
		const total = texteComplet
			.split('')
			.filter(filtreFonction)
			.reduce((sum, lettre) => sum + (LETTRE_VALEUR[lettre] || 0), 0);
		
		return {
			valeurs: [total],
			valeurFinale: reduireNombre(total)
		};
	};

	const calculerFeuilles = (prenoms, nom) => 
		calculerValeursTexte(prenoms, nom, lettre => VOYELLES.has(lettre));

	const calculerFruits = (prenoms, nom) => 
		calculerValeursTexte(prenoms, nom, lettre => !VOYELLES.has(lettre) && LETTRE_VALEUR[lettre]);

	const calculerDynamique = (racine1, racine2, tronc) => {
		const total = racine1.valeurFinale + racine2.valeurFinale + tronc.valeurFinale;
		return reduireNombre(total);
	};

	const calculerEcorce = (jour) => reduireNombre(jour);

	const calculerBranches = (prenoms, nom) => {
		return normaliserTexte(`${prenoms} ${nom}`)
			.split('')
			.filter(lettre => ['A', 'J', 'S'].includes(lettre))
			.length;
	};

	const calculerQualites = (prenoms, nom) => {
		const texteComplet = normaliserTexte(`${prenoms} ${nom}`);
		const qualites = {};
		
		// Initialisation
		for (let i = 1; i <= 9; i++) {
			qualites[i] = 0;
		}
		
		// Comptage
		texteComplet.split('').forEach(lettre => {
			const valeur = LETTRE_VALEUR[lettre];
			if (valeur) qualites[valeur]++;
		});
		
		// Réduction des nombres > 9
		Object.keys(qualites).forEach(key => {
			if (qualites[key] > 9) {
				qualites[key] = reduireNombre(qualites[key]);
			}
		});
		
		return qualites;
	};

	const calculerDefis = (jour, mois, annee) => {
		const jourR = reduireNombre(jour);
		const moisR = reduireNombre(mois);
		const anneeR = reduireNombre(annee);
		
		const calculerDefi = (a, b) => {
			const diff = Math.abs(a - b);
			return diff === 0 ? 9 : diff;
		};
		
		const defi1 = calculerDefi(jourR, moisR);
		const defi2 = calculerDefi(jourR, anneeR);
		const defi3 = calculerDefi(defi1, defi2);
		const defi4 = calculerDefi(moisR, anneeR);
		
		return { defi1, defi2, defi3, defi4 };
	};

	const calculerAnneePersonnelle = (jour, mois, anneeActuelle = new Date().getFullYear()) => 
		reduireNombre(jour + mois + anneeActuelle);

	// Exécution des calculs principaux
	const racine1 = calculerRacine1(jour, mois, annee);
	const racine2 = calculerRacine2(prenoms, nom);
	const tronc = calculerTronc(jour, mois);
	const feuilles = calculerFeuilles(prenoms, nom);
	const fruits = calculerFruits(prenoms, nom);

	// Fonction de recherche des mémoires corrigée
	const chercherMemoires = () => {
		const memoires = [];
		const memoiresUniques = new Map(); // Pour éviter les doublons
		
		// Fonction helper pour ajouter une mémoire
		const ajouterMemoire = (nombre, lieu, importance) => {
			if (MEMOIRES_FAMILIALES.has(nombre)) {
				const cle = `${nombre}-${lieu}`;
				if (!memoiresUniques.has(cle)) {
					memoiresUniques.set(cle, { nombre, lieu, importance });
				}
			}
		};
		
		// Vérifications directes
		ajouterMemoire(jour, 'Jour de naissance', 'Très forte');
		
		// Total de l'année
		const totalAnnee = annee.toString()
			.split('')
			.reduce((sum, digit) => sum + parseInt(digit, 10), 0);
		ajouterMemoire(totalAnnee, 'Année de naissance', 'Très forte');
		
		// Vérification de toutes les valeurs intermédiaires des calculs
		racine1.valeurs.forEach(val => {
			ajouterMemoire(val, 'Première racine (Chemin de vie)', 'Très forte');
		});
		
		racine2.valeurs.forEach(val => {
			ajouterMemoire(val, 'Seconde racine (Expression)', 'Très forte');
		});
		
		tronc.valeurs.forEach(val => {
			ajouterMemoire(val, 'Tronc (Clé de l\'âme)', 'Très forte');
		});
		
		feuilles.valeurs.forEach(val => {
			ajouterMemoire(val, 'Feuilles (Besoins affectifs)', 'Forte');
		});
		
		fruits.valeurs.forEach(val => {
			ajouterMemoire(val, 'Fruits (Besoins de réalisation)', 'Forte');
		});
		
		// Vérification des défis
		const defis = calculerDefis(jour, mois, annee);
		Object.entries(defis).forEach(([nom, valeur]) => {
			ajouterMemoire(valeur, `Défi ${nom.replace('defi', '')}`, 'Moyenne');
		});
		
		// Conversion de la Map en array
		return Array.from(memoiresUniques.values());
	};

	// Construction du résultat final
	const resultat = {
		racine1: racine1.valeurFinale.toString(),
		racine2: racine2.valeurFinale.toString(),
		tronc: tronc.valeurFinale.toString(),
		dynamique: calculerDynamique(racine1, racine2, tronc).toString(),
		ecorce: calculerEcorce(jour).toString(),
		branches: calculerBranches(prenoms, nom).toString(),
		feuilles: feuilles.valeurFinale.toString(),
		fruits: fruits.valeurFinale.toString(),
		qualites: calculerQualites(prenoms, nom),
		memoires: chercherMemoires(),
		defis: calculerDefis(jour, mois, annee),
		anneePersonnelle: calculerAnneePersonnelle(jour, mois).toString()
	};

	return JSON.stringify(resultat);
};