import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { id } = useParams();
  const choosePhoto = useRef<HTMLInputElement>(null);
  const [editNameMode, setEditNameMode] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("Old Profile Log: ", imageUrl);
    setLoading(true);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Extract the old file name from the existing profile image URL
      const oldImageUrl = user.profile_image;
      if (oldImageUrl) {
        const oldFileName = oldImageUrl.split("/").pop();
        await supabase.storage.from("images").remove([oldFileName]);
      }

      // Generate a unique file name
      const fileName = `${Date.now()}-${file.name}`;

      // Upload the new image
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, file, { contentType: file.type });

      if (error) throw error;

      // Get the new image URL
      const url = supabase.storage.from("images").getPublicUrl(fileName)
        .data.publicUrl;

      // Update the state and store it in the database
      setImageUrl(url);
      await saveImageUrl(url);

      // Update user state with new profile image
      setUser((prevUser: any) => ({ ...prevUser, profile_image: url }));
    } catch (error) {
      console.error("Error handling file upload:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveImageUrl = async (url: string) => {
    const { error } = await supabase
      .from("users_detail")
      .update({ profile_image: url })
      .eq("id", id); // Replace with the actual user ID

    if (error) {
      console.error("Database error:", error.message);
      return;
    }
  };

  const fetchUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log("No authenticated user found.");
      return;
    }

    const { data, error } = await supabase
      .from("users_detail")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("Error fetching user details:", error);
      return;
    }
    const userData = { ...user, ...data };
    setUser(userData);
    setNewUsername(userData.username);
  };
  useEffect(() => {
    fetchUserData();
  }, [id]);

  const handleChangeName = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newUsername.trim() !== "") {
      try {
        const { error } = await supabase
          .from("users_detail")
          .update({ username: newUsername })
          .eq("id", user.id);

        if (error) throw error;
        setNewUsername("");

        setEditNameMode(false);
        const newUserData = { ...user, username: newUsername };
        setUser(newUserData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (!user) return <></>;

  return (
    <div className="w-full ">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-4 pl-0 transition-all active:scale-[0.90]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 16 16"
          >
            <path
              fill="none"
              stroke="gray"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
            />
          </svg>
        </button>
        <div className="ml-5">
          <div className="flex items-center gap-4">
            <h4 className="text-2xl font-semibold text-regular mt-1">
              Profile
            </h4>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 mt-4">
        <div className="col-span-2">
          <div className="w-full bg-white border rounded-lg shadow">
            <div className="flex items-center gap-5 p-10">
              <div className="w-36 h-36 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={user.profile_image}
                  alt=""
                />
              </div>
              <div className="">
                <div className="flex items-center gap-3">
                  {editNameMode ? (
                    <form onSubmit={handleChangeName}>
                      <input
                        type="text"
                        className="px-3 py-2 border rounded-lg focus:outline-blue-500 text-gray-600"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                    </form>
                  ) : (
                    <h3 className="text-3xl font-bold text-regular">
                      {user.username}
                    </h3>
                  )}
                  <span className="text-sm tracking-wide flex items-center space-x-1">
                    <svg
                      className="h-6 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-gray-600 text-lg">Verified</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      choosePhoto.current?.click();
                    }}
                    className="text-gray-500 px-5 py-2 mt-5 border-2 text-sm border-second transition-all hover:bg-slate-100 active:scale-[0.95] rounded-md flex items-center gap-2"
                  >
                    {loading ? (
                      "Uploading..."
                    ) : (
                      <span className="flex items-center gap-2">
                        {" "}
                        Upload new Photo
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                        </svg>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setEditNameMode(!editNameMode)}
                    className="text-gray-500 px-3 py-2 mt-5 border-2 text-sm border-second transition-all hover:bg-slate-100 active:scale-[0.95] rounded-md flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                  </button>
                </div>
                <input
                  ref={choosePhoto}
                  className="hidden"
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  name=""
                  id=""
                />
              </div>
            </div>
            <div className="grid grid-cols-3 mt-6 border-t-2 p-10">
              <div className="col-span-1">
                <p className="text-[18px] text-gray-500 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                  </svg>{" "}
                  Email:
                </p>
                <h4 className="text-[16px] mt-1 font-medium text-regular">
                  {user?.email}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
