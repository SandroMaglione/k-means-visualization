<h1>K-means visualization</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.1-blue.svg" />
  <a href="https://twitter.com/SandroMaglione">
    <img alt="Twitter: SandroMaglione" src="https://img.shields.io/twitter/follow/SandroMaglione.svg?style=social" target="_blank" />
  </a>
</p>

Javascript page that displays **graphically** the various step of a **k-means algorithm**. The script saves all the data an allows you to **download a .json** file with the details of every iteration.

**[Try it Out](http://www.sandromaglione.com/k-means/)**

![How the page looks like](https://www.sandromaglione.com/images/k-means-screen.png)



## Getting started
You just need to open the **[webpage](http://www.sandromaglione.com/k-means/)**. You will see a **2D graph** with some small square points and three big circle points. The squares represent our data. For the purpose of understanding the algorithm, we have a 2D plane and therefore two features in our dataset. The circles are our random initialized **centroids**.

## How the algorithm works
For each centroid, which comes with its own random color, the algorithm finds all its nearest square points. Those points are connected to the centroid and they become of his same color.
We can now click on *START* in the top-left corner of the screen (to visualize the algorithm more slowly, modify the speed of the animation to around 1000 (1s), see the settings section for more info).
The centroid will move to be at the mean center of their nearest points.
For example, if the nearest point of centorid `C1(3, 2)` are `[A(4, 3), B(2, 0), C(4, 1)]`, then after the first iteration C1 will move to:

```
C1(3, 2)
A(4, 3), B(2, 0), C(3, 3)

C1new = (4 + 2 + 3 / 3, 3 + 0 + 3 / 3) = (9 / 3, 6 / 3) = (3, 2)
```

After this first iteration, the nearest point for each centroid will change. **We keep running the same steps until convergence**, when will have our final k-means clusters.

The webpage will run the algorithm again with a new set of centroid. At the end of the specified number of loops, you can **download all the data about each iteration in JSON format** by clicking the *DOWNLOAD* button at the top-left of the screen.

## Settings
You can set different parameters from the form on the top-left corner of the screen.

| Parameter       	| Value                                                                                  	|
|-----------------	|----------------------------------------------------------------------------------------	|
| Animation speed 	| Speed between each centroid moves in milliseconds.                                     	|
| Cycles          	| Number or complete loops (generation of new centroids) before the full algorithm ends. 	|
| Pointers        	| Number of squares.                                                                     	|
| Centers         	| Number of centroids.                                                                   	|


## Built with
- Vanilla Javascript
- HTML5
- CSS3

## Versioning
- v1.0.1 - 29 August 2019
- v1.0.0 - 14 July 2019

## Author
- **Sandro Maglione**
* Website: [sandromaglione.com](https://www.sandromaglione.com/)
* Linkedin: [Sandro Maglione](https://www.linkedin.com/in/sandro-maglione97/)
* Twitter: [@SandroMaglione](https://twitter.com/SandroMaglione)
* Github: [@SandroMaglione](https://github.com/SandroMaglione)

## License
GNU General Public License v3.0, see the [LICENSE.md](https://github.com/SandroMaglione/k-means-visualization/blob/master/LICENSE) file for details.
