const DEFAULT_API_KEY = 'k_jcpmqxqh'

function main() {
	let isDark = true
	const formEl = document.getElementById('searchForm')
	searchMovie('The shawshank redemption', DEFAULT_API_KEY)
	formEl.addEventListener('submit', async function (ev) {
		ev.preventDefault()
		const searchValue = document.getElementById('searchInput').value
		const apiKeyValue = document.getElementById('apiInput').value
		await searchMovie(searchValue, apiKeyValue)
	})

	document.getElementById('toggleThemeButton').addEventListener('click', ev => {
		if (isDark) {
			document.querySelector('body').setAttribute('class', '')
			isDark = false
		} else {
			document.querySelector('body').setAttribute('class', 'dark')
			isDark = true
		}
	})
}

async function searchMovie(movieName, apiKey) {
	if (movieName == '') return

	const res = await fetch(
		`https://imdb-api.com/en/api/searchmovie/${apiKey}/${movieName}`
	)
	if (res.status !== 200) {
		console.error('bad status ', res.status)
		return
	}

	const data = await res.json()

	if (data.results.length === 0) {
		console.log('NO RESULTS')
		return
	}
	const movieID = data.results[0].id

	const movieInfoRes = await fetch(
		`https://imdb-api.com/en/api/title/${apiKey}/${movieID}`
	)
	if (movieInfoRes.status !== 200) {
		console.error('bad status ', res.status)
		return
	}

	movieInfoData = await movieInfoRes.json()

	document.getElementById('movieTitle').innerText = movieInfoData.title
	document.getElementById('movieYearLength').innerText =
		movieInfoData.year + ' . ' + movieInfoData.runtimeStr
	document.getElementById('movieRating').innerText = movieInfoData.imDbRating
	document.getElementById('movieDesc').innerText = movieInfoData.plot
	document.getElementById('movieDirector').innerText = movieInfoData.directorList[0].name
	document.getElementById('movieWriter').innerText = movieInfoData.writerList[0].name
	document.getElementById('movieStars').innerText = movieInfoData.stars
	document.getElementById('movieImage').setAttribute('src', movieInfoData.image)

	if (movieInfoData.awards) {
		const awardsParts = movieInfoData.awards.split('|').map(p => p.trim())
		document.getElementById('awards').style.display = 'flex'
		document.getElementById('awardsLeft').innerText = awardsParts[0]
		document.getElementById('awardsRight').innerText = awardsParts[1]
	} else {
		document.getElementById('awards').style.display = 'none'
	}

	if (movieInfoData.genreList && movieInfoData.genreList.length > 0) {
		const tagsListEl = document.getElementById('movieTags')
		tagsListEl.innerHTML = ''
		movieInfoData.genreList.forEach(item => {
			const tagItem = document.createElement('div')
			tagItem.setAttribute('class', 'tag')
			tagItem.innerText = item.value
			tagsListEl.appendChild(tagItem)
		})

		if (movieInfoData.similars && movieInfoData.similars.length > 0) {
			const similars = movieInfoData.similars.filter((item, i) => i < 4)
			const similarCardsEl = document.getElementById('similarCards')
			similarCardsEl.innerHTML = ''
			similars.forEach(item => {
				const cardEl = document.createElement('div')
				cardEl.setAttribute('class', 'card')
				const imageEl = document.createElement('img')
				imageEl.setAttribute('src', item.image)
				imageEl.setAttribute('class', 'card__image')

				const titleEl = document.createElement('div')
				titleEl.setAttribute('class', 'card__title')
				titleEl.innerText = item.title

				const ratingEl = document.createElement('div')
				ratingEl.innerText = item.imDbRating

				cardEl.appendChild(imageEl)
				cardEl.appendChild(ratingEl)
				cardEl.appendChild(titleEl)

				similarCardsEl.appendChild(cardEl)
			})
		}
	}
}

window.onload = main
