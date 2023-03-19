import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../firebaseConfig/firebase";
import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function ShowEpisodeTable({ showDetails }) {
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [totalWatched, setTotalWatched] = useState(0);
  const [episodeStatusArray, setEpisodeStatusArray] = useState(
    new Array(showDetails.episodes.length).fill(false)
  );
  const [watchTimeRemaining, setWatchTimeRemaining] = useState(0);
  const [showTable, setShowTable] = useState(false);

  const computeWatchTime = () => {
    let timeRemaining = 0;
    showDetails.episodes.forEach((episode, index) => {
      if (!episodeStatusArray[index]) {
        timeRemaining += episode.length;
      }
    });
    return timeRemaining;
  };

  const getTimeRemaining = (totalMinutes) => {
    if (totalMinutes == 0) {
      return "Completed!";
    }

    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (hours == 0) {
      return minutes + "min left";
    } else if (minutes == 0) {
      return hours + "h left";
    } else {
      return hours + "h" + minutes + " left";
    }
  };

  const popualteWatchedEpisodes = async (user) => {
    const episodesRef = collection(db, "watchedEpisodes");
    const q = query(
      episodesRef,
      where("uid", "==", user.uid),
      where("showName", "==", showDetails.name)
    );
    const querySnapshot = await getDocs(q);
    const watchedEpisodes = new Set();
    querySnapshot.forEach((episode) => {
      watchedEpisodes.add(episode.id);
    });
    setTotalWatched(watchedEpisodes.size);
    setEpisodeStatusArray(
      showDetails.episodes.map((episode) => {
        const episodeId = user.uid + episode.title.replace(/\s/g, "");
        return watchedEpisodes.has(episodeId);
      })
    );
  };

  const postWatchedEpisode = async (index) => {
    const docId =
      user.uid + showDetails.episodes[index].title.replace(/\s/g, "");
    try {
      await setDoc(doc(db, "watchedEpisodes", docId), {
        uid: user.uid,
        episodeTitle: showDetails.episodes[index].title,
        showName: showDetails.name,
      });
    } catch (e) {
      setTotalWatched((cur) => {
        return cur - 1;
      });
      console.error("Error adding document: ", e);
    }
  };

  const deleteWatchedEpisode = async (index) => {
    const docId =
      user.uid + showDetails.episodes[index].title.replace(/\s/g, "");
    try {
      await deleteDoc(doc(db, "watchedEpisodes", docId));
    } catch (e) {
      setTotalWatched((cur) => {
        return cur + 1;
      });
      console.error("Error deleting document: ", e);
    }
  };

  const onCheckboxClick = (e, index) => {
    if (e.target.checked) {
      setTotalWatched((cur) => {
        return cur + 1;
      });
      user && postWatchedEpisode(index);
    } else {
      setTotalWatched((cur) => {
        return cur - 1;
      });
      user && deleteWatchedEpisode(index);
    }
    setEpisodeStatusArray((isWatchedArray) => {
      isWatchedArray[index] = e.target.checked;
      return isWatchedArray;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        popualteWatchedEpisodes(user);
      }
    });
    setWatchTimeRemaining(computeWatchTime());
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setWatchTimeRemaining(computeWatchTime());
  }, [totalWatched]);

  return (
    <>
      <button
        onClick={() =>
          setShowTable((isShown) => {
            return !isShown;
          })
        }
      >
        <div className="show-info">
          <p>{showDetails.name}</p>
          <p>
            {totalWatched}/{showDetails.totalEpisodes}
          </p>
          <progress
            max={showDetails.totalEpisodes}
            value={totalWatched}
          ></progress>
          <p>{getTimeRemaining(watchTimeRemaining)}</p>
        </div>
      </button>
      {showTable && (
        <table>
          <thead>
            <tr>
              <th>Episode Name</th>
              <th>Length</th>
              <th>Watched</th>
            </tr>
          </thead>
          <tbody>
            {showDetails.episodes.map((episode, index) => {
              return (
                <tr key={index}>
                  <td>{episode.title}</td>
                  <td>{episode.length} min</td>
                  <td>
                    <input
                      type={"checkbox"}
                      onChange={(e) => onCheckboxClick(e, index)}
                      checked={episodeStatusArray[index]}
                    ></input>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

export default ShowEpisodeTable;
