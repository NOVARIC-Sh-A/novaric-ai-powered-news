"""The 3:4 fill crop stays inside the original and does not invent pixels."""
import unittest

import cv2
import numpy as np

from scripts.build_portrait_frames import FRAME_ASPECT, detect_face, fill_crop, framing


class TestPortraitFill(unittest.TestCase):
    def test_balla_fills_without_a_side_band(self):
        with open("public/politicians/official/vip46.jpg", "rb") as handle:
            data = handle.read()
        image = cv2.imdecode(np.frombuffer(data, dtype=np.uint8), cv2.IMREAD_COLOR)
        height, width = image.shape[:2]
        face = detect_face(image)
        self.assertIsNotNone(face)
        _crop, inset, padded = framing(width, height, face)
        self.assertTrue(padded)
        self.assertLess(inset["width"], 0.8)
        filled = fill_crop(width, height, face)
        self.assertIsNotNone(filled)
        self.assertLessEqual(filled["x"] + filled["width"], width)
        self.assertLessEqual(filled["y"] + filled["height"], height)
        aspect = filled["width"] / filled["height"]
        self.assertAlmostEqual(aspect, FRAME_ASPECT, delta=0.02)
        eye_x = face[4]
        centre = (eye_x - filled["x"]) / filled["width"]
        self.assertGreater(centre, 0.45)
        self.assertLess(centre, 0.62)


if __name__ == "__main__":
    unittest.main()
