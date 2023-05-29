import { useEffect } from "react";
import { app, db } from "./firebaseConfig/firebase";
import {
  collection,
  collectionGroup,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { starwars } from "./data/starwars";

import Navbar from "./components/Navbar";
import ShowEpisodeTable from "./components/ShowEpisodeTable";

import "./App.css";

function App() {
  const populateCuratedShows = async (user) => {
    const showsSnapshot = await getDocs(collection(db, "shows"));
    showsSnapshot.forEach((show) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(show.id, " => ", show.data());
    });

    const episodes = query(collectionGroup(db, "episodes"));
    const querySnapshot = await getDocs(episodes);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    // const q = query(
    //   showsRef,
    //   where("uid", "==", user.uid),
    //   where("showName", "==", showDetails.name)
    // );
    // const querySnapshot = await getDocs(q);
    // const watchedEpisodes = new Set();
    // querySnapshot.forEach((episode) => {
    //   watchedEpisodes.add(episode.id);
    // });
    // setTotalWatched(watchedEpisodes.size);
    // setEpisodeStatusArray(
    //   showDetails.episodes.map((episode) => {
    //     const episodeId = user.uid + episode.title.replace(/\s/g, "");
    //     return watchedEpisodes.has(episodeId);
    //   })
    // );
  };

  useEffect(() => {
    populateCuratedShows();
  }, []);

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main>
        <div className="container">
          <div className="page-header">
            <h1>Track your shows!</h1>
            <p>
              Use the list to track how many episodes you have watched from your
              favorite shows
            </p>
          </div>
          <div className="show-table">
            {starwars.map((showDetails, index) => {
              return (
                <div key={index}>
                  <ShowEpisodeTable showDetails={showDetails} />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
